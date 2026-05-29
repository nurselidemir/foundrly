import Foundation

struct AdminService {
    private let client = APIClient()

    func loadDashboard(token: String) async throws -> AdminDashboard {
        try await client.send(path: "api/admin/dashboard/", token: token)
    }

    func loadUsers(token: String) async throws -> [AdminUserItem] {
        try await client.send(path: "api/admin/users/", token: token)
    }

    func getUserDetail(token: String, id: Int) async throws -> AdminUserItem {
        try await client.send(path: "api/admin/users/\(id)/", token: token)
    }

    func updateUserRole(token: String, id: Int, update: AdminRoleUpdate) async throws {
        let body = try JSONEncoder().encode(update)
        try await client.sendWithoutResponse(path: "api/admin/users/\(id)/role/", method: "PATCH", token: token, body: body)
    }

    func updateUserModeration(token: String, id: Int, update: AdminModerationUpdate) async throws {
        let body = try JSONEncoder().encode(update)
        try await client.sendWithoutResponse(path: "api/admin/users/\(id)/moderation/", method: "PATCH", token: token, body: body)
    }

    func createUser(token: String, request: AdminCreateUserRequest) async throws -> AdminUserItem {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/admin/users/create/", method: "POST", token: token, body: body)
    }

    func loadProjects(token: String) async throws -> [AdminProjectItem] {
        try await client.send(path: "api/admin/projects/", token: token)
    }

    func deleteProject(token: String, id: Int) async throws {
        try await client.sendDelete(path: "api/admin/projects/\(id)/", token: token)
    }

    func loadEvents(token: String) async throws -> [EventItem] {
        try await client.send(path: "api/admin/events/", token: token)
    }

    func createEvent(token: String, request: CreateEventRequest) async throws -> EventItem {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/admin/events/", method: "POST", token: token, body: body)
    }

    func updateEvent(token: String, id: Int, request: CreateEventRequest) async throws -> EventItem {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/admin/events/\(id)/", method: "PATCH", token: token, body: body)
    }

    func deleteEvent(token: String, id: Int) async throws {
        try await client.sendDelete(path: "api/admin/events/\(id)/", token: token)
    }

    func loadGuides(token: String) async throws -> [GuideItem] {
        try await client.send(path: "api/admin/guides/", token: token)
    }

    func createGuide(token: String, request: CreateGuideRequest) async throws -> GuideItem {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/admin/guides/", method: "POST", token: token, body: body)
    }

    func updateGuide(token: String, id: Int, request: CreateGuideRequest) async throws -> GuideItem {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/admin/guides/\(id)/", method: "PATCH", token: token, body: body)
    }

    func deleteGuide(token: String, id: Int) async throws {
        try await client.sendDelete(path: "api/admin/guides/\(id)/", token: token)
    }

    func loadMentors(token: String) async throws -> [MentorSummary] {
        try await client.send(path: "api/admin/mentors/", token: token)
    }

    func loadVerifications(token: String) async throws -> [AdminVerificationItem] {
        try await client.send(path: "api/admin/verification-requests/", token: token)
    }

    func reviewVerification(token: String, id: Int, status: String, note: String) async throws {
        let body = try JSONSerialization.data(withJSONObject: ["status": status, "reviewed_note": note])
        try await client.sendWithoutResponse(path: "api/admin/verification-requests/\(id)/review/", method: "PATCH", token: token, body: body)
    }
}
