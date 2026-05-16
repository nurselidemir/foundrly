import Foundation

struct CurrentUser: Codable, Identifiable {
    let id: Int
    let email: String
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let interests: [String]
    let is_verified_talent: Bool
    let is_premium: Bool
    let is_mentor: Bool?
    let is_staff: Bool?
    let is_superuser: Bool?
    let date_joined: String
}

struct PublicUserSummary: Codable, Identifiable {
    let id: Int
    let email: String?
    let full_name: String
    let title: String
    let is_verified_talent: Bool
    let is_premium: Bool?
}

struct PublicReview: Codable, Identifiable {
    let id: Int
    let reviewer: PublicReviewAuthor
    let project: PublicReviewProject
    let rating: Int
    let comment: String
    let created_at: String
}

struct PublicReviewAuthor: Codable, Identifiable {
    let id: Int
    let full_name: String
    let title: String
    let is_verified_talent: Bool
}

struct PublicReviewProject: Codable, Identifiable {
    let id: Int
    let title: String
}

struct PublicProfileProject: Codable, Identifiable {
    let id: Int
    let title: String
    let summary: String
    let created_at: String
}

struct EligibleReviewApplication: Codable, Identifiable {
    var id: Int { application_id }
    let application_id: Int
    let project_id: Int
    let project_title: String
    let counterpart_role: String
}

struct PublicProfile: Codable, Identifiable {
    let id: Int
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let interests: [String]
    let is_verified_talent: Bool
    let is_premium: Bool
    let date_joined: String
    let average_rating: Double?
    let reviews_count: Int
    let reviews: [PublicReview]
    let recent_projects: [PublicProfileProject]
    let eligible_review_applications: [EligibleReviewApplication]
}

struct CreateReviewRequest: Encodable {
    let application_id: Int
    let rating: Int
    let comment: String
}

struct VerificationRequestPayload: Encodable {
    let requested_title: String
    let portfolio_url: String
    let note: String
}

struct PremiumSubscriptionResponse: Codable {
    let message: String
    let is_premium: Bool
}

struct PremiumSubscriptionRequest: Encodable {
    let plan: String
}
