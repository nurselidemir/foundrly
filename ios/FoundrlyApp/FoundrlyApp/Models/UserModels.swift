import Foundation

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
        case id, email, full_name, title, bio, skills, interests, profile_picture
        case is_verified_talent, is_premium, is_mentor, mentor_credits, mentor_price, mentor_balance
        case is_staff, is_superuser, date_joined
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        email = try container.decode(String.self, forKey: .email)
        full_name = (try? container.decodeIfPresent(String.self, forKey: .full_name)) ?? ""
        title = (try? container.decodeIfPresent(String.self, forKey: .title)) ?? ""
        bio = (try? container.decodeIfPresent(String.self, forKey: .bio)) ?? ""
        skills = (try? container.decodeIfPresent([String].self, forKey: .skills)) ?? []
        interests = (try? container.decodeIfPresent([String].self, forKey: .interests)) ?? []
        profile_picture = try container.decodeIfPresent(String.self, forKey: .profile_picture)
        is_verified_talent = (try? container.decodeIfPresent(Bool.self, forKey: .is_verified_talent)) ?? false
        is_premium = (try? container.decodeIfPresent(Bool.self, forKey: .is_premium)) ?? false
        is_mentor = try container.decodeIfPresent(Bool.self, forKey: .is_mentor)
        mentor_credits = try container.decodeIfPresent(Int.self, forKey: .mentor_credits)
        is_staff = try container.decodeIfPresent(Bool.self, forKey: .is_staff)
        is_superuser = try container.decodeIfPresent(Bool.self, forKey: .is_superuser)
        date_joined = (try? container.decodeIfPresent(String.self, forKey: .date_joined)) ?? ""

        mentor_price = try container.decodeFlexibleDoubleIfPresent(forKey: .mentor_price)
        mentor_balance = try container.decodeFlexibleDoubleIfPresent(forKey: .mentor_balance)
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
    let active_application_id: Int?

    enum CodingKeys: String, CodingKey {
        case id, full_name, title, bio, skills, interests
        case is_verified_talent, is_premium, date_joined, average_rating, reviews_count, reviews
        case recent_projects, eligible_review_applications, active_application_id
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(Int.self, forKey: .id)
        full_name = try container.decode(String.self, forKey: .full_name)
        title = try container.decode(String.self, forKey: .title)
        bio = try container.decode(String.self, forKey: .bio)
        skills = try container.decode([String].self, forKey: .skills)
        interests = try container.decode([String].self, forKey: .interests)
        is_verified_talent = try container.decode(Bool.self, forKey: .is_verified_talent)
        is_premium = try container.decode(Bool.self, forKey: .is_premium)
        date_joined = try container.decode(String.self, forKey: .date_joined)
        reviews_count = try container.decode(Int.self, forKey: .reviews_count)
        reviews = try container.decode([PublicReview].self, forKey: .reviews)
        recent_projects = try container.decode([PublicProfileProject].self, forKey: .recent_projects)
        eligible_review_applications = try container.decode([EligibleReviewApplication].self, forKey: .eligible_review_applications)
        active_application_id = try container.decodeIfPresent(Int.self, forKey: .active_application_id)

        average_rating = try container.decodeFlexibleDoubleIfPresent(forKey: .average_rating)
    }
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
        case id, full_name, title, bio, skills, profile_picture, is_mentor, mentor_price
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

        mentor_price = try container.decodeFlexibleDouble(forKey: .mentor_price)
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
    let meeting_time: String?
    let user_confirmed: Bool?
    let price_at_request: Double
    let offered_price: Double
    let reserved_amount: Double?
    let commission_rate: Double
    let mentor_completed_at: String?
    let user_confirmed_at: String?
    let released_at: String?
    let disputed_at: String?
    let dispute_reason: String?
    let status_label: String?
    let created_at: String

    enum CodingKeys: String, CodingKey {
        case id, mentor, mentor_details, user, user_details, message, status
        case meeting_time, user_confirmed, price_at_request, offered_price, reserved_amount
        case commission_rate, mentor_completed_at, user_confirmed_at, released_at, disputed_at
        case dispute_reason, status_label, created_at
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
        meeting_time = try container.decodeIfPresent(String.self, forKey: .meeting_time)
        user_confirmed = try container.decodeIfPresent(Bool.self, forKey: .user_confirmed)
        mentor_completed_at = try container.decodeIfPresent(String.self, forKey: .mentor_completed_at)
        user_confirmed_at = try container.decodeIfPresent(String.self, forKey: .user_confirmed_at)
        released_at = try container.decodeIfPresent(String.self, forKey: .released_at)
        disputed_at = try container.decodeIfPresent(String.self, forKey: .disputed_at)
        dispute_reason = try container.decodeIfPresent(String.self, forKey: .dispute_reason)
        status_label = try container.decodeIfPresent(String.self, forKey: .status_label)
        created_at = try container.decode(String.self, forKey: .created_at)

        price_at_request = try container.decodeFlexibleDouble(forKey: .price_at_request)
        offered_price = try container.decodeFlexibleDouble(forKey: .offered_price)
        reserved_amount = try container.decodeFlexibleDoubleIfPresent(forKey: .reserved_amount)
        commission_rate = try container.decodeFlexibleDouble(forKey: .commission_rate)
    }
}

struct MentorActionPayload: Encodable {
    let action: String
    let offered_price: Double?
    let meeting_time: String?
}

struct MentorConfirmPayload: Encodable {
    let action: String
    let dispute_reason: String?
}

extension KeyedDecodingContainer {
    func decodeFlexibleDouble(forKey key: KeyedDecodingContainer<K>.Key) throws -> Double {
        if let doubleValue = try? decode(Double.self, forKey: key) {
            return doubleValue
        }
        if let stringValue = try? decode(String.self, forKey: key), let doubleValue = Double(stringValue) {
            return doubleValue
        }
        if let intValue = try? decode(Int.self, forKey: key) {
            return Double(intValue)
        }
        return try decode(Double.self, forKey: key)
    }

    func decodeFlexibleDoubleIfPresent(forKey key: KeyedDecodingContainer<K>.Key) throws -> Double? {
        if let doubleValue = try? decodeIfPresent(Double.self, forKey: key) {
            return doubleValue
        }
        if let stringValue = try? decodeIfPresent(String.self, forKey: key), let doubleValue = Double(stringValue) {
            return doubleValue
        }
        if let intValue = try? decodeIfPresent(Int.self, forKey: key) {
            return Double(intValue)
        }
        return nil
    }
}
