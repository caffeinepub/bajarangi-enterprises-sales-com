import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // Old types (without AI prompt history)
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

  type OldActor = {
    admin : ?Admin;
    products : Map.Map<Text, Product>;
    businessInfo : BusinessInfo;
  };

  // New types (with AI prompt history)
  type AIPromptEntry = {
    promptText : Text;
    timestamp : Time.Time;
    transformationDescriptor : Text;
  };

  type NewActor = {
    admin : ?Admin;
    products : Map.Map<Text, Product>;
    businessInfo : BusinessInfo;
    aiPromptHistory : Map.Map<Time.Time, AIPromptEntry>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    { old with aiPromptHistory = Map.empty<Time.Time, AIPromptEntry>() };
  };
};
