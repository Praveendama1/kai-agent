import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

actor {
  type SessionId = Text;

  type Message = {
    role : Text; // "user" or "assistant"
    content : Text;
    timestamp : Time.Time;
  };

  type UserData = {
    principal : Principal;
    var sessions : Map.Map<SessionId, [Message]>;
    var is2FAEnabled : Bool;
  };

  module UserData {
    public func compareByPrincipal(user1 : UserData, user2 : UserData) : Order.Order {
      Principal.compare(user1.principal, user2.principal);
    };
  };

  // Store user data
  let users = Map.empty<Principal, UserData>();

  /// Returns `true` if the given caller is registered and `false` otherwise.
  public query ({ caller }) func isRegistered() : async Bool {
    users.containsKey(caller);
  };

  // Register new user
  /// If the user is already registered, this function has no effect.
  public shared ({ caller }) func register() : async () {
    if (users.containsKey(caller)) {
      return;
    };
    let newUser = {
      principal = caller;
      var sessions = Map.empty<SessionId, [Message]>();
      var is2FAEnabled = false;
    };
    users.add(caller, newUser);
  };

  /// Traps if the given user does not exist.
  func getNoUser(user : Principal) : UserData {
    switch (users.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userData) { userData };
    };
  };

  // Add message to session
  /// Traps if the session does not exist.
  public shared ({ caller }) func addMessage(sessionId : SessionId, message : Message) : async () {
    let user = getNoUser(caller);
    switch (user.sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session " # sessionId # " does not exist") };
      case (?messages) {
        user.sessions.add(
          sessionId,
          messages.concat([message]),
        );
      };
    };
  };

  // Create new session
  /// If the session already exists, this function has no effect.
  public shared ({ caller }) func createSession(sessionId : SessionId) : async () {
    let user = getNoUser(caller);
    if (user.sessions.containsKey(sessionId)) {
      return;
    };
    user.sessions.add(sessionId, []);
  };

  // Get all sessions for user
  public query ({ caller }) func getAllSessions() : async [SessionId] {
    getNoUser(caller).sessions.keys().toArray();
  };

  // Get messages for session
  /// Traps if the user or session does not exist.
  public query ({ caller }) func getMessages(sessionId : SessionId) : async [Message] {
    switch (getNoUser(caller).sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session " # sessionId # " does not exist") };
      case (?messages) { messages };
    };
  };

  // Enable or disable 2FA
  public shared ({ caller }) func set2FAEnabled(enabled : Bool) : async () {
    getNoUser(caller).is2FAEnabled := enabled;
  };

  // Check if 2FA is enabled
  public query ({ caller }) func is2FAEnabled() : async Bool {
    getNoUser(caller).is2FAEnabled;
  };
};
