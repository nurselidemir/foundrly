import Foundation

struct GuideItem: Codable, Identifiable {
    let id: Int
    let title: String
    let read: String
    let tone: String
    let summary: String
    let bullets: [String]
    let is_published: Bool
    let created_at: String?
    let updated_at: String?
}

struct CreateGuideRequest: Encodable {
    let title: String
    let read: String
    let tone: String
    let summary: String
    let bullets: [String]
    let is_published: Bool
}
