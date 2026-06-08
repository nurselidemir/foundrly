import Foundation
import Combine

@MainActor
final class AppShellViewModel: ObservableObject {
    @Published var summary: DashboardSummary?
    @Published var projects: [ProjectCard] = []
    @Published var recommendedProjects: [RecommendedProjectMatch] = []
    @Published var aiMatches: [CandidateMatch] = []
    @Published var receivedApplications: [TeamApplication] = []
    @Published var sentApplications: [TeamApplication] = []
    @Published var mentors: [MentorSummary] = []
    @Published var mentorRequests: [MentorRequestSummary] = []
    @Published var events: [EventItem] = []
    @Published var guides: [GuideItem] = []
    @Published var showcaseUsers: [ShowcaseUser] = []
    @Published var myMentorRequests: [MentorRequestSummary] = []
    @Published var threads: [MessageThread] = []
    @Published var selectedThread: ThreadDetail?
    @Published var selectedPublicProfile: PublicProfile?
    @Published var messageDraft = ""
    @Published var feedbackMessage = "" {
        didSet {
            let msg = feedbackMessage
            if !msg.isEmpty {
                Task {
                    try? await Task.sleep(nanoseconds: 3_000_000_000)
                    Task { @MainActor in
                        if self.feedbackMessage == msg {
                            self.feedbackMessage = ""
                        }
                    }
                }
            }
        }
    }
    @Published var selectedTabTag = 0
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
            async let receivedTask = service.loadReceivedApplications(token: token)
            async let sentTask = service.loadSentApplications(token: token)

            let (summary, projects, threads, receivedApplications, sentApplications) = try await (summaryTask, projectsTask, threadsTask, receivedTask, sentTask)
            self.summary = summary
            self.projects = projects
            self.threads = threads
            self.receivedApplications = receivedApplications
            self.sentApplications = sentApplications
            if let first = threads.first {
                self.selectedThread = try await service.loadThreadDetail(token: token, applicationId: first.application_id)
            }
            self.mentors = (try? await service.loadMentors(token: token)) ?? []
            if summary.profile.is_mentor == true {
                self.mentorRequests = (try? await service.loadMentorPanelRequests(token: token)) ?? []
            } else {
                self.mentorRequests = []
            }
            if summary.profile.is_premium {
                self.recommendedProjects = (try? await service.loadRecommendedProjects(token: token)) ?? []
                self.myMentorRequests = (try? await service.loadUserMentorRequests(token: token)) ?? []
            } else {
                self.recommendedProjects = []
                self.myMentorRequests = []
            }

            // Load events, guides & showcase users via EventService
            let showcase = try? await EventService().loadShowcase(token: token)
            self.events = showcase?.events ?? []
            self.guides = showcase?.guides ?? []
            self.showcaseUsers = showcase?.users ?? []

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

    func runAIMatching(session: AppSession, projectId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            aiMatches = try await service.loadProjectMatches(token: token, projectId: projectId)
            feedbackMessage = ""
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func updateApplicationStatus(session: AppSession, applicationId: Int, status: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.updateApplicationStatus(token: token, applicationId: applicationId, status: status)
            await load(session: session)
            feedbackMessage = status == "accepted" ? "Başvuru kabul edildi." : "Başvuru reddedildi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func requestMentor(session: AppSession, mentorId: Int, message: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.createMentorRequest(token: token, mentorId: mentorId, message: message)
            feedbackMessage = "Mentörlük talebin iletildi."
            await load(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func updateMentorRequest(session: AppSession, requestId: Int, status: String, offeredPrice: Double? = nil) async {
        // Legacy wrapper — delegates to action-based mentorAction API
        let action: String
        switch status {
        case "accepted": action = "offer"
        case "completed": action = "mark_completed"
        case "declined": action = "decline"
        default: action = status
        }
        await mentorAction(session: session, requestId: requestId, action: action, offeredPrice: offeredPrice)
    }

    // MARK: - Events & Guides

    func loadEvents(session: AppSession) async {
        do {
            let showcase = try await EventService().loadShowcase(token: session.accessToken)
            self.events = showcase.events
            self.guides = showcase.guides
            self.showcaseUsers = showcase.users
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func registerEvent(session: AppSession, eventId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            try await EventService().registerEvent(token: token, eventId: eventId)
            feedbackMessage = "Etkinliğe kayıt oldunuz."
            await loadEvents(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    // MARK: - Friend Requests

    func respondFriendRequest(session: AppSession, requestId: Int, status: String) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.respondFriendRequest(token: token, requestId: requestId, status: status)
            feedbackMessage = status == "accepted" ? "Arkadaşlık isteği kabul edildi." : "Arkadaşlık isteği reddedildi."
            await load(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func sendFriendRequest(session: AppSession, receiverId: Int) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.sendFriendRequest(token: token, receiverId: receiverId)
            feedbackMessage = "Arkadaşlık isteği gönderildi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    // MARK: - Mentorship Actions

    func userConfirmMentor(session: AppSession, requestId: Int, action: String, disputeReason: String? = nil) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.userConfirmMentor(token: token, requestId: requestId, action: action, disputeReason: disputeReason)
            switch action {
            case "accept_offer": feedbackMessage = "Teklif kabul edildi, ödeme rezerve edildi."
            case "confirm_completion": feedbackMessage = "Görüşme onaylandı, ödeme serbest bırakıldı."
            case "open_dispute": feedbackMessage = "İtiraz açıldı."
            default: feedbackMessage = "İşlem tamamlandı."
            }
            await load(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    func mentorAction(session: AppSession, requestId: Int, action: String, offeredPrice: Double? = nil, meetingTime: String? = nil) async {
        guard let token = session.accessToken else { return }
        do {
            try await service.mentorAction(token: token, requestId: requestId, action: action, offeredPrice: offeredPrice, meetingTime: meetingTime)
            switch action {
            case "offer": feedbackMessage = "Zaman ve ücret önerisi gönderildi."
            case "decline": feedbackMessage = "Talep reddedildi."
            case "mark_completed": feedbackMessage = "Görüşme tamamlandı olarak işaretlendi."
            default: feedbackMessage = "İşlem tamamlandı."
            }
            await load(session: session)
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }

    // MARK: - Profile

    func updateProfile(session: AppSession, fields: [String: Any]) async {
        guard let token = session.accessToken else { return }
        do {
            let updatedUser = try await service.updateProfile(token: token, fields: fields)
            session.currentUser = updatedUser
            feedbackMessage = "Profil güncellendi."
        } catch {
            feedbackMessage = error.localizedDescription
        }
    }
}
