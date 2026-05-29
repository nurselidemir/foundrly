import Foundation
import Combine

@MainActor
final class AdminViewModel: ObservableObject {
    @Published var dashboard: AdminDashboard?
    @Published var users: [AdminUserItem] = []
    @Published var projects: [AdminProjectItem] = []
    @Published var events: [EventItem] = []
    @Published var guides: [GuideItem] = []
    @Published var mentors: [MentorSummary] = []
    @Published var verifications: [AdminVerificationItem] = []
    @Published var feedbackMessage = ""
    @Published var isLoading = false
    @Published var searchText = ""

    private let service = AdminService()

    func load(session: AppSession) async {
        guard let token = session.accessToken else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            async let dashboardTask = service.loadDashboard(token: token)
            async let usersTask = service.loadUsers(token: token)
            async let projectsTask = service.loadProjects(token: token)
            async let eventsTask = service.loadEvents(token: token)
            async let guidesTask = service.loadGuides(token: token)
            async let mentorsTask = service.loadMentors(token: token)
            async let verificationsTask = service.loadVerifications(token: token)

            let (dashboard, users, projects, events, guides, mentors, verifications) = try await (
                dashboardTask, usersTask, projectsTask, eventsTask, guidesTask, mentorsTask, verificationsTask
            )

            self.dashboard = dashboard
            self.users = users
            self.projects = projects
            self.events = events
            self.guides = guides
            self.mentors = mentors
            self.verifications = verifications
            self.feedbackMessage = ""
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadUsers(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.users = try await service.loadUsers(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func createUser(session: AppSession, request: AdminCreateUserRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.createUser(token: token, request: request)
            self.feedbackMessage = "Kullanıcı/Mentör başarıyla oluşturuldu."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func updateUserRole(session: AppSession, userId: Int, update: AdminRoleUpdate) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.updateUserRole(token: token, id: userId, update: update)
            self.feedbackMessage = "Kullanıcı yetkileri güncellendi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func updateUserModeration(session: AppSession, userId: Int, update: AdminModerationUpdate) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.updateUserModeration(token: token, id: userId, update: update)
            self.feedbackMessage = "Kullanıcı durum/ücret bilgisi güncellendi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadProjects(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.projects = try await service.loadProjects(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func deleteProject(session: AppSession, projectId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.deleteProject(token: token, id: projectId)
            self.feedbackMessage = "Proje silindi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadEvents(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.events = try await service.loadEvents(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func createEvent(session: AppSession, request: CreateEventRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.createEvent(token: token, request: request)
            self.feedbackMessage = "Etkinlik oluşturuldu."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func updateEvent(session: AppSession, eventId: Int, request: CreateEventRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.updateEvent(token: token, id: eventId, request: request)
            self.feedbackMessage = "Etkinlik güncellendi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func deleteEvent(session: AppSession, eventId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.deleteEvent(token: token, id: eventId)
            self.feedbackMessage = "Etkinlik silindi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadGuides(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.guides = try await service.loadGuides(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func createGuide(session: AppSession, request: CreateGuideRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.createGuide(token: token, request: request)
            self.feedbackMessage = "Makale oluşturuldu."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func updateGuide(session: AppSession, guideId: Int, request: CreateGuideRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.updateGuide(token: token, id: guideId, request: request)
            self.feedbackMessage = "Makale güncellendi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func deleteGuide(session: AppSession, guideId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.deleteGuide(token: token, id: guideId)
            self.feedbackMessage = "Makale silindi."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadMentors(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.mentors = try await service.loadMentors(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func loadVerifications(session: AppSession) async {
        guard let token = session.accessToken else { return }
        do {
            self.verifications = try await service.loadVerifications(token: token)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }

    func reviewVerification(session: AppSession, id: Int, status: String, note: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.reviewVerification(token: token, id: id, status: status, note: note)
            self.feedbackMessage = "Doğrulama talebi sonuçlandırıldı."
            await load(session: session)
        } catch {
            self.feedbackMessage = error.localizedDescription
        }
    }
}
