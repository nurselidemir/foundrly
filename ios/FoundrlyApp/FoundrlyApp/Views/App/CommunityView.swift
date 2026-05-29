import SwiftUI

struct CommunityView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 18) {
                        // Title Card
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Topluluk ve Etkinlikler")
                                .font(.system(size: 28, weight: .black, design: .rounded))
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            Text("Hackathonlar, networking oturumları ve uzman rehberleri ile Foundrly topluluğuna katılın.")
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()

                        // Upcoming Events Section
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                Text("Yaklaşan Etkinlikler")
                                    .font(.title3.bold())
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                Spacer()
                                NavigationLink("Tümünü Gör") {
                                    EventsView(viewModel: viewModel)
                                }
                                .font(.caption.bold())
                                .foregroundStyle(FoundrlyTheme.primary)
                            }

                            if viewModel.events.isEmpty {
                                Text("Yaklaşan etkinlik bulunmuyor.")
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            } else {
                                ForEach(viewModel.events.prefix(3)) { event in
                                    VStack(alignment: .leading, spacing: 10) {
                                        HStack {
                                            Text(event.tag.uppercased())
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundStyle(FoundrlyTheme.accent)
                                                .padding(.horizontal, 8)
                                                .padding(.vertical, 4)
                                                .background(FoundrlyTheme.accent.opacity(0.12))
                                                .clipShape(Capsule())
                                            Spacer()
                                            Text(event.event_date)
                                                .font(.caption.bold())
                                                .foregroundStyle(FoundrlyTheme.accent)
                                        }

                                        Text(event.title)
                                            .font(.headline)
                                            .foregroundStyle(FoundrlyTheme.textPrimary)
                                        Text(event.location)
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)

                                        if event.is_registered == true {
                                            Text("Kayıt Alındı ✓")
                                                .font(.caption.bold())
                                                .foregroundStyle(FoundrlyTheme.accent)
                                                .padding(.horizontal, 12)
                                                .padding(.vertical, 6)
                                                .background(FoundrlyTheme.accent.opacity(0.12))
                                                .clipShape(Capsule())
                                        } else {
                                            Button("Etkinliğe Kayıt Ol") {
                                                Task {
                                                    await viewModel.registerEvent(session: session, eventId: event.id)
                                                }
                                            }
                                            .font(.caption.bold())
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.primary)
                                            .foregroundStyle(.white)
                                            .clipShape(Capsule())
                                        }
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                                }
                            }
                        }
                        .foundrlyCard()

                        // Entrepreneur Guides Section
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                Text("Girişim Merkezi Rehberleri")
                                    .font(.title3.bold())
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                Spacer()
                                NavigationLink("Tümünü Gör") {
                                    HubView(viewModel: viewModel)
                                }
                                .font(.caption.bold())
                                .foregroundStyle(FoundrlyTheme.primary)
                            }

                            if viewModel.guides.isEmpty {
                                Text("Aktif rehber bulunmuyor.")
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            } else {
                                ForEach(viewModel.guides.prefix(3)) { guide in
                                    VStack(alignment: .leading, spacing: 8) {
                                        Text(guide.title)
                                            .font(.headline)
                                            .foregroundStyle(FoundrlyTheme.textPrimary)
                                        Text(guide.summary)
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .lineLimit(2)
                                        
                                        HStack {
                                            Text(guide.tone)
                                                .font(.system(size: 8, weight: .bold))
                                                .foregroundStyle(FoundrlyTheme.accent)
                                            Spacer()
                                            Text(guide.read)
                                                .font(.system(size: 8))
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                        }
                                        .padding(.top, 4)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                                }
                            }
                        }
                        .foundrlyCard()
                    }
                    .padding(20)
                }
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Topluluk")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await viewModel.loadEvents(session: session)
            }
        }
    }
}
