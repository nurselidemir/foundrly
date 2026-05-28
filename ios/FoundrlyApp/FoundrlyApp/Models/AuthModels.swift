import Foundation

struct TokenResponse: Decodable {
    let access: String
    let refresh: String
}

struct RegisterRequest: Encodable {
    let email: String
    let password: String
    let full_name: String
    let title: String
    let bio: String
    let skills: [String]
    let interests: [String]
}

struct LoginRequest: Encodable {
    let email: String
    let password: String
}
