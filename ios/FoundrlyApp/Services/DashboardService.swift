import Foundation

struct DashboardService {
    private let client = APIClient()

    func loadSummary(token: String) async throws -> DashboardSummary {
        try await client.send(path: "api/dashboard/summary/", token: token)
    }

    func loadProjects(token: String) async throws -> [ProjectCard] {
        try await client.send(path: "api/projects/", token: token)
    }

    func loadRecommendedProjects(token: String) async throws -> [RecommendedProjectMatch] {
        try await client.send(path: "api/dashboard/recommended-projects/", token: token)
    }

    func loadProjectMatches(token: String, projectId: Int) async throws -> [CandidateMatch] {
        try await client.send(path: "api/projects/\(projectId)/matches/", token: token)
    }

    func loadReceivedApplications(token: String) async throws -> [TeamApplication] {
        try await client.send(path: "api/applications/?received=true", token: token)
    }

    func updateApplicationStatus(token: String, applicationId: Int, status: String) async throws {
        let body = try JSONSerialization.data(withJSONObject: ["status": status])
        try await client.sendWithoutResponse(
            path: "api/applications/\(applicationId)/status/",
            method: "PATCH",
            token: token,
            body: body
        )
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

    func loadMentors(token: String) async throws -> [MentorSummary] {
        try await client.send(path: "api/mentors/", token: token)
    }

    func createMentorRequest(token: String, mentorId: Int, message: String) async throws {
        let body = try JSONEncoder().encode(MentorRequestPayload(mentor: mentorId, message: message))
        try await client.sendWithoutResponse(
            path: "api/mentors/requests/",
            method: "POST",
            token: token,
            body: body
        )
    }

    func loadMentorPanelRequests(token: String) async throws -> [MentorRequestSummary] {
        try await client.send(path: "api/mentors/my-requests/", token: token)
    }

    func updateMentorRequestStatus(token: String, requestId: Int, status: String, offeredPrice: Double? = nil) async throws {
        let body = try JSONEncoder().encode(MentorStatusPayload(status: status, offered_price: offeredPrice))
        try await client.sendWithoutResponse(
            path: "api/mentors/requests/\(requestId)/status/",
            method: "PATCH",
            token: token,
            body: body
        )
    }
}
