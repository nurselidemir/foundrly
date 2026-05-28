import Foundation

private func decodeFlexibleDouble<K: CodingKey>(from container: KeyedDecodingContainer<K>, forKey key: K) throws -> Double? {
    if let value = try container.decodeIfPresent(Double.self, forKey: key) {
        return value
    }
    if let stringValue = try container.decodeIfPresent(String.self, forKey: key) {
        return Double(stringValue)
    }
    return nil
}

struct CurrentUser: Codable, Identifiable {
    let id: Int
    let email: String
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let interests: [String]
    let profile_picture: String?
    let is_verified_talent: Bool
    let is_premium: Bool
    let is_mentor: Bool?
    let mentor_credits: Int?
    let mentor_price: Double?
    let mentor_balance: Double?
    let is_staff: Bool?
    let is_superuser: Bool?
    let date_joined: String

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case full_name
        case title
        case bio
        case skills
        case interests
        case profile_picture
        case is_verified_talent
        case is_premium
        case is_mentor
        case mentor_credits
        case mentor_price
        case mentor_balance
        case is_staff
        case is_superuser
        case date_joined
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeIfPresent(Int.self, forKey: .id) ?? 0
        email = try container.decodeIfPresent(String.self, forKey: .email) ?? ""
        full_name = try container.decodeIfPresent(String.self, forKey: .full_name) ?? ""
        title = try container.decodeIfPresent(String.self, forKey: .title) ?? ""
        bio = try container.decodeIfPresent(String.self, forKey: .bio) ?? ""
        skills = try container.decodeIfPresent([String].self, forKey: .skills) ?? []
        interests = try container.decodeIfPresent([String].self, forKey: .interests) ?? []
        profile_picture = try container.decodeIfPresent(String.self, forKey: .profile_picture)
        is_verified_talent = try container.decodeIfPresent(Bool.self, forKey: .is_verified_talent) ?? false
        is_premium = try container.decodeIfPresent(Bool.self, forKey: .is_premium) ?? false
        is_mentor = try container.decodeIfPresent(Bool.self, forKey: .is_mentor)
        mentor_credits = try container.decodeIfPresent(Int.self, forKey: .mentor_credits)
        mentor_price = try decodeFlexibleDouble(from: container, forKey: .mentor_price)
        mentor_balance = try decodeFlexibleDouble(from: container, forKey: .mentor_balance)
        is_staff = try container.decodeIfPresent(Bool.self, forKey: .is_staff)
        is_superuser = try container.decodeIfPresent(Bool.self, forKey: .is_superuser)
        date_joined = try container.decodeIfPresent(String.self, forKey: .date_joined) ?? ""
    }

    init(dictionary: [String: Any]) {
        id = dictionary["id"] as? Int ?? 0
        email = dictionary["email"] as? String ?? ""
        full_name = dictionary["full_name"] as? String ?? ""
        title = dictionary["title"] as? String ?? ""
        bio = dictionary["bio"] as? String ?? ""
        skills = dictionary["skills"] as? [String] ?? []
        interests = dictionary["interests"] as? [String] ?? []
        profile_picture = dictionary["profile_picture"] as? String
        is_verified_talent = dictionary["is_verified_talent"] as? Bool ?? false
        is_premium = dictionary["is_premium"] as? Bool ?? false
        is_mentor = dictionary["is_mentor"] as? Bool
        mentor_credits = dictionary["mentor_credits"] as? Int
        if let value = dictionary["mentor_price"] as? Double {
            mentor_price = value
        } else if let value = dictionary["mentor_price"] as? String {
            mentor_price = Double(value)
        } else {
            mentor_price = nil
        }
        if let value = dictionary["mentor_balance"] as? Double {
            mentor_balance = value
        } else if let value = dictionary["mentor_balance"] as? String {
            mentor_balance = Double(value)
        } else {
            mentor_balance = nil
        }
        is_staff = dictionary["is_staff"] as? Bool
        is_superuser = dictionary["is_superuser"] as? Bool
        date_joined = dictionary["date_joined"] as? String ?? ""
    }
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

struct MentorSummary: Codable, Identifiable {
    let id: Int
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let profile_picture: String?
    let is_mentor: Bool
    let mentor_price: Double

    enum CodingKeys: String, CodingKey {
        case id
        case full_name
        case title
        case bio
        case skills
        case profile_picture
        case is_mentor
        case mentor_price
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        full_name = try container.decode(String.self, forKey: .full_name)
        title = try container.decode(String.self, forKey: .title)
        bio = try container.decode(String.self, forKey: .bio)
        skills = try container.decode([String].self, forKey: .skills)
        profile_picture = try container.decodeIfPresent(String.self, forKey: .profile_picture)
        is_mentor = try container.decode(Bool.self, forKey: .is_mentor)
        mentor_price = try decodeFlexibleDouble(from: container, forKey: .mentor_price) ?? 0
    }
}

struct MentorRequestPayload: Encodable {
    let mentor: Int
    let message: String
}

struct MentorRequestSummary: Codable, Identifiable {
    let id: Int
    let mentor: Int?
    let mentor_details: MentorSummary?
    let user: Int?
    let user_details: MentorSummary?
    let message: String
    let status: String
    let price_at_request: Double
    let offered_price: Double
    let commission_rate: Double
    let created_at: String

    enum CodingKeys: String, CodingKey {
        case id
        case mentor
        case mentor_details
        case user
        case user_details
        case message
        case status
        case price_at_request
        case offered_price
        case commission_rate
        case created_at
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        mentor = try container.decodeIfPresent(Int.self, forKey: .mentor)
        mentor_details = try container.decodeIfPresent(MentorSummary.self, forKey: .mentor_details)
        user = try container.decodeIfPresent(Int.self, forKey: .user)
        user_details = try container.decodeIfPresent(MentorSummary.self, forKey: .user_details)
        message = try container.decode(String.self, forKey: .message)
        status = try container.decode(String.self, forKey: .status)
        price_at_request = try decodeFlexibleDouble(from: container, forKey: .price_at_request) ?? 0
        offered_price = try decodeFlexibleDouble(from: container, forKey: .offered_price) ?? 0
        commission_rate = try decodeFlexibleDouble(from: container, forKey: .commission_rate) ?? 0
        created_at = try container.decode(String.self, forKey: .created_at)
    }
}

struct MentorStatusPayload: Encodable {
    let status: String
    let offered_price: Double?
}
