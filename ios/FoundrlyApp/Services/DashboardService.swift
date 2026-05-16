import Foundation

struct DashboardService {
    private let client = APIClient()

    func loadSummary(token: String) async throws -> DashboardSummary {
        try await client.send(path: "api/dashboard/summary/", token: token)
    }

    func loadProjects(token: String) async throws -> [ProjectCard] {
        try await client.send(path: "api/projects/", token: token)
    }

    func createProject(token: String, request: CreateProjectRequest) async throws -> ProjectCard {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/projects/", method: "POST", token: token, body: body)
    }

    func applyToProject(token: String, request: ApplyProjectRequest) async throws -> TeamApplication {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/applications/", method: "POST", token: token, body: body)
    }

    func loadThreads(token: String) async throws -> [MessageThread] {
        try await client.send(path: "api/messages/threads/", token: token)
    }

    func loadThreadDetail(token: String, applicationId: Int) async throws -> ThreadDetail {
        try await client.send(path: "api/messages/threads/\(applicationId)/", token: token)
    }

    func sendMessage(token: String, applicationId: Int, content: String) async throws {
        let body = try JSONEncoder().encode(CreateMessageRequest(content: content))
        try await client.sendWithoutResponse(
            path: "api/messages/threads/\(applicationId)/messages/",
            method: "POST",
            token: token,
            body: body
        )
    }

    func loadPublicProfile(token: String?, userId: Int) async throws -> PublicProfile {
        try await client.send(path: "api/users/\(userId)/", token: token)
    }

    func createReview(token: String, userId: Int, request: CreateReviewRequest) async throws {
        let body = try JSONEncoder().encode(request)
        try await client.sendWithoutResponse(
            path: "api/users/\(userId)/reviews/",
            method: "POST",
            token: token,
            body: body
        )
    }

    func activatePremium(token: String, plan: String) async throws -> PremiumSubscriptionResponse {
        let body = try JSONEncoder().encode(PremiumSubscriptionRequest(plan: plan))
        return try await client.send(path: "api/premium/subscription/", method: "POST", token: token, body: body)
    }

    func submitVerification(token: String, request: VerificationRequestPayload) async throws {
        let body = try JSONEncoder().encode(request)
        try await client.sendWithoutResponse(
            path: "api/verification-requests/",
            method: "POST",
            token: token,
            body: body
        )
    }
}
