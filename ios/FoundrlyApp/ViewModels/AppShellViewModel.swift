import Foundation

@MainActor
final class AppShellViewModel: ObservableObject {
    @Published var summary: DashboardSummary?
    @Published var projects: [ProjectCard] = []
    @Published var threads: [MessageThread] = []
    @Published var selectedThread: ThreadDetail?
    @Published var selectedPublicProfile: PublicProfile?
    @Published var messageDraft = ""
    @Published var feedbackMessage = ""
    @Published var isLoading = false

    private let service = DashboardService()

    func load(session: AppSession) async {
        guard let token = session.accessToken else { return }
        isLoading = true
        defer { isLoading = false }

        do {
            async let summaryTask = service.loadSummary(token: token)
            async let projectsTask = service.loadProjects(token: token)
            async let threadsTask = service.loadThreads(token: token)

            let (summary, projects, threads) = try await (summaryTask, projectsTask, threadsTask)
            self.summary = summary
            self.projects = projects
            self.threads = threads
            if let first = threads.first {
                self.selectedThread = try await service.loadThreadDetail(token: token, applicationId: first.application_id)
            }
            session.currentUser = summary.profile
            feedbackMessage = ""
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func createProject(session: AppSession, request: CreateProjectRequest) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.createProject(token: token, request: request)
            await load(session: session)
            feedbackMessage = "Proje başarıyla oluşturuldu."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func apply(session: AppSession, projectId: Int, message: String) async {
        guard let token = session.accessToken else { return }
        do {
            _ = try await service.applyToProject(
                token: token,
                request: ApplyProjectRequest(project: projectId, message: message)
            )
            await load(session: session)
            feedbackMessage = "Başvurun gönderildi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func selectThread(session: AppSession, applicationId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            selectedThread = try await service.loadThreadDetail(token: token, applicationId: applicationId)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func sendMessage(session: AppSession) async {
        guard let token = session.accessToken, let thread = selectedThread, !messageDraft.isEmpty else { return }
        do {
            try await service.sendMessage(token: token, applicationId: thread.application_id, content: messageDraft)
            messageDraft = ""
            selectedThread = try await service.loadThreadDetail(token: token, applicationId: thread.application_id)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func loadPublicProfile(session: AppSession, userId: Int) async {
        do {
            selectedPublicProfile = try await service.loadPublicProfile(token: session.accessToken, userId: userId)
            feedbackMessage = ""
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func submitReview(session: AppSession, userId: Int, applicationId: Int, rating: Int, comment: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.createReview(
                token: token,
                userId: userId,
                request: CreateReviewRequest(application_id: applicationId, rating: rating, comment: comment)
            )
            await loadPublicProfile(session: session, userId: userId)
            feedbackMessage = "Yorum eklendi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func activatePremium(session: AppSession, plan: String) async {
        guard let token = session.accessToken else { return }
        do {
            let response = try await service.activatePremium(token: token, plan: plan)
            feedbackMessage = response.message
            await load(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func submitVerification(session: AppSession, requestedTitle: String, portfolioURL: String, note: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.submitVerification(
                token: token,
                request: VerificationRequestPayload(
                    requested_title: requestedTitle,
                    portfolio_url: portfolioURL,
                    note: note
                )
            )
            feedbackMessage = "Doğrulanmış yetenek başvurun iletildi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }
}
