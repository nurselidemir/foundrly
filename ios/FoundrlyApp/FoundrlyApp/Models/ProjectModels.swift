import Foundation

struct ProjectCard: Codable, Identifiable {
    let id: Int
    let owner: PublicUserSummary
    let title: String
    let summary: String
    let problem_statement: String?
    let tech_stack: [String]?
    let needed_roles: [String]?
    let is_premium_highlighted: Bool
    let created_at: String
    let updated_at: String
}

struct DashboardMetrics: Codable {
    let owned_projects_count: Int
    let received_applications_count: Int
    let pending_received_applications_count: Int
    let accepted_received_applications_count: Int
    let sent_applications_count: Int
    let accepted_memberships_count: Int
}

struct FriendRequestSummary: Codable, Identifiable {
    let id: Int
    let sender: Int
    let sender_name: String
    let receiver: Int
    let receiver_name: String
    let status: String
    let created_at: String
}

struct DashboardSummary: Codable {
    let profile: CurrentUser
    let metrics: DashboardMetrics
    let recent_projects: [ProjectCard]
    let friend_requests: [FriendRequestSummary]?
}

struct TeamApplication: Codable, Identifiable {
    let id: Int
    let project: Int
    let applicant: PublicUserSummary
    let message: String
    let status: String
    let project_details: ProjectApplicationProject?
    let created_at: String
}

struct ProjectApplicationProject: Codable, Identifiable {
    let id: Int
    let title: String
    let owner: PublicUserSummary
}

struct RecommendedProjectMatch: Codable, Identifiable {
    var id: Int { project.id }
    let project: ProjectCard
    let score: Double
    let match_label: String
    let recommended_role: String?
    let ai_summary: String
    let matched_skills: [String]
    let missing_skills: [String]
}

struct CandidateMatch: Codable, Identifiable {
    var id: Int { user.id }
    let user: PublicUserSummary
    let score: Double
    let match_label: String
    let recommended_role: String?
    let ai_summary: String
    let matched_skills: [String]
    let missing_skills: [String]
}

struct CreateProjectRequest: Encodable {
    let title: String
    let summary: String
    let problem_statement: String
    let tech_stack: [String]
    let needed_roles: [String]
}

struct ApplyProjectRequest: Encodable {
    let project: Int
    let message: String
}
