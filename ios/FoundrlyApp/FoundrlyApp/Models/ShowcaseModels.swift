import Foundation

struct ShowcaseResponse: Codable {
    let projects: [ProjectCard]
    let users: [ShowcaseUser]
    let events: [EventItem]
    let guides: [GuideItem]
}

struct ShowcaseUser: Codable, Identifiable {
    let id: Int
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let interests: [String]
    let profile_picture: String?
    let is_verified_talent: Bool
    let is_premium: Bool
}
