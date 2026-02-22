import Float "mo:core/Float";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

actor {
  type Admin = Principal;
  type ProductId = Text;

  type Product = {
    id : ProductId;
    name : Text;
    price : Float;
    shortDescription : Text;
    fullDescription : Text;
    imageUrl : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type BusinessInfo = {
    businessName : Text;
    contactPhone : Text;
    contactEmail : Text;
    businessAddress : Text;
    aboutText : Text;
  };

  module Product {
    public func compare(left : Product, right : Product) : Order.Order {
      Text.compare(left.name, right.name);
    };
  };

  let products = Map.empty<ProductId, Product>();

  var businessInfo : BusinessInfo = {
    businessName = "BAJARANGI ENTERPRISES";
    contactPhone = "+1234567890";
    contactEmail = "contact@bajarangi.com";
    businessAddress = "Business Address";
    aboutText = "About BAJARANGI ENTERPRISES";
  };

  var admin : ?Admin = ?Principal.fromText("2vxsx-fae");

  // Authentication
  public shared ({ caller }) func isAdmin(checkedPrincipal : Principal) : async Bool {
    switch (admin) {
      case (null) { false };
      case (?storedAdmin) { storedAdmin == checkedPrincipal };
    };
  };

  // Product CRUD
  public shared ({ caller }) func addProduct(
    name : Text,
    price : Float,
    shortDescription : Text,
    fullDescription : Text,
    imageUrl : Text,
  ) : async Product {
    assertIsAdmin(caller);

    let id = (products.size() + 1).toText();
    let timestamp = Time.now();
    let product = {
      id;
      name;
      price;
      shortDescription;
      fullDescription;
      imageUrl;
      createdAt = timestamp;
      updatedAt = timestamp;
    };
    products.add(id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(
    id : ProductId,
    name : Text,
    price : Float,
    shortDescription : Text,
    fullDescription : Text,
    imageUrl : Text,
  ) : async Product {
    assertIsAdmin(caller);

    let existingProduct = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    let updatedProduct = {
      existingProduct with
      name;
      price;
      shortDescription;
      fullDescription;
      imageUrl;
      updatedAt = Time.now();
    };

    products.add(id, updatedProduct);
    updatedProduct;
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    assertIsAdmin(caller);
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Business Info Management
  public query ({ caller }) func getBusinessInfo() : async BusinessInfo {
    businessInfo;
  };

  public shared ({ caller }) func updateBusinessInfo(
    businessName : Text,
    contactPhone : Text,
    contactEmail : Text,
    businessAddress : Text,
    aboutText : Text,
  ) : async BusinessInfo {
    assertIsAdmin(caller);

    businessInfo := {
      businessName;
      contactPhone;
      contactEmail;
      businessAddress;
      aboutText;
    };
    businessInfo;
  };

  func assertIsAdmin(caller : Principal) {
    let isAdmin = switch (admin) {
      case (?storedAdmin) { storedAdmin == caller };
      case (null) { false };
    };
    if (not isAdmin) {
      Runtime.trap("Unauthorized: Not an admin");
    };
  };
};
