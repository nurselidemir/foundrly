import Foundation

struct EventService {
    private let client = APIClient()

    func loadShowcase(token: String? = nil) async throws -> ShowcaseResponse {
        try await client.send(path: "api/showcase/", token: token)
    }

    func registerEvent(token: String, eventId: Int) async throws {
        let body = try JSONEncoder().encode(EventRegistrationRequest(event: eventId))
        try await client.sendWithoutResponse(path: "api/events/register/", method: "POST", token: token, body: body)
    }
}
