import Foundation

struct AdminDashboard: Codable {
    let total_users: Int
    let total_projects: Int
    let total_events: Int
    let total_guides: Int
    let total_mentors: Int
}

struct AdminUserItem: Codable, Identifiable {
    let id: Int
    let email: String
    let full_name: String
    let title: String
    let is_premium: Bool
    let is_mentor: Bool
    let is_verified_talent: Bool
    let is_staff: Bool
    let is_superuser: Bool
    let date_joined: String
}

struct AdminCreateUserRequest: Encodable {
    let email: String
    let password: String
    let full_name: String
    let title: String
    let is_mentor: Bool
    let mentor_price: Double?
}

struct AdminRoleUpdate: Encodable {
    let is_mentor: Bool?
    let is_verified_talent: Bool?
    let is_premium: Bool?
    let is_staff: Bool?
    let is_superuser: Bool?
}

struct AdminModerationUpdate: Encodable {
    let is_active: Bool?
    let is_verified_talent: Bool?
    let is_premium: Bool?
    let is_mentor: Bool?
    let mentor_price: Double?
}

struct AdminVerificationItem: Codable, Identifiable {
    let id: Int
    let user: AdminUserItem
    let requested_title: String
    let portfolio_url: String
    let note: String
    let status: String
    let reviewed_note: String?
    let created_at: String
    let reviewed_at: String?
}

struct AdminProjectItem: Codable, Identifiable {
    let id: Int
    let owner: PublicUserSummary
    let title: String
    let summary: String
    let is_premium_highlighted: Bool
    let created_at: String
    let applications_count: Int?
    let accepted_applications_count: Int?
}
