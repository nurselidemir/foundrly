import Foundation

struct MessageThread: Codable, Identifiable {
    var id: Int { application_id }
    let application_id: Int
    let project: MessageProject
    let counterpart: MessageCounterpart
    let latest_message: LatestMessage?
}

struct MessageProject: Codable {
    let id: Int
    let title: String
    let summary: String
}

struct MessageCounterpart: Codable, Identifiable {
    let id: Int
    let full_name: String
    let title: String
    let is_verified_talent: Bool?
}

struct LatestMessage: Codable, Identifiable {
    let id: Int
    let content: String
}

struct ThreadDetail: Codable {
    let application_id: Int
    let project: MessageProject
    let counterpart: MessageCounterpart
    let messages: [ThreadMessage]
}

struct ThreadMessage: Codable, Identifiable {
    let id: Int
    let sender: ThreadSender
    let content: String
    let created_at: String
}

struct ThreadSender: Codable {
    let full_name: String
    let email: String
}

struct CreateMessageRequest: Encodable {
    let content: String
}
