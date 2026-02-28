import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Types
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

  type AIPromptEntry = {
    promptText : Text;
    timestamp : Time.Time;
    transformationDescriptor : Text;
  };

  type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(left : Product, right : Product) : Order.Order {
      Text.compare(left.name, right.name);
    };
  };

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  stable var admin : ?Admin = ?Principal.fromText("2vxsx-fae");

  let products = Map.empty<ProductId, Product>();

  var businessInfo : BusinessInfo = {
    businessName = "BAJARANGI ENTERPRISES";
    contactPhone = "+1234567890";
    contactEmail = "contact@bajarangi.com";
    businessAddress = "Business Address";
    aboutText = "About BAJARANGI ENTERPRISES";
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var aiPromptHistory = Map.empty<Time.Time, AIPromptEntry>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product CRUD
  public shared ({ caller }) func addProduct(
    name : Text,
    price : Float,
    shortDescription : Text,
    fullDescription : Text,
    imageUrl : Text,
  ) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Business Info Management
  public query func getBusinessInfo() : async BusinessInfo {
    businessInfo;
  };

  public shared ({ caller }) func updateBusinessInfo(
    businessName : Text,
    contactPhone : Text,
    contactEmail : Text,
    businessAddress : Text,
    aboutText : Text,
  ) : async BusinessInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update business info");
    };

    businessInfo := {
      businessName;
      contactPhone;
      contactEmail;
      businessAddress;
      aboutText;
    };
    businessInfo;
  };

  // AI Prompt Editing Backend
  public shared ({ caller }) func saveAIPromptEntry(promptText : Text, transformationDescriptor : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save AI prompt entries");
    };
    let entry : AIPromptEntry = {
      promptText;
      timestamp = Time.now();
      transformationDescriptor;
    };
    aiPromptHistory.add(entry.timestamp, entry);
  };

  public query ({ caller }) func getAllAIPromptEntries() : async [AIPromptEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve AI prompt entries");
    };
    aiPromptHistory.values().toArray();
  };
};

