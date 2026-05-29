import Foundation

struct EventItem: Codable, Identifiable {
    let id: Int
    let title: String
    let description: String
    let location: String
    let event_date: String
    let tag: String
    let is_online: Bool
    let is_registered: Bool?
    let created_at: String?
}

struct EventRegistrationRequest: Encodable {
    let event: Int
}

struct EventRegistrationResponse: Codable {
    let id: Int
    let event: Int
    let created_at: String
}

struct CreateEventRequest: Encodable {
    let title: String
    let description: String
    let location: String
    let event_date: String
    let tag: String
    let is_online: Bool
}
