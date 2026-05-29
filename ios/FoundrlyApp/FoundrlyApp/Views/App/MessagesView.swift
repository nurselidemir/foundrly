import SwiftUI

struct MessagesView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        NavigationSplitView {
            Group {
                if viewModel.threads.isEmpty {
                    VStack(alignment: .leading, spacing: 16) {
                        FoundrlySectionHeader(
                            eyebrow: "Mesajlar",
                            title: "Henüz aktif konuşma yok",
                            subtitle: "Mesajlaşma yalnızca kabul edilen başvurularda açılır. Bir başvurun kabul edildiğinde bu alan otomatik olarak dolacak."
                        )
                        .foundrlyCard()
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    .background(FoundrlyTheme.background)
                } else {
                    List(viewModel.threads) { thread in
                        Button {
                            Task { await viewModel.selectThread(session: session, applicationId: thread.application_id) }
                        } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                Text(thread.counterpart.full_name)
                                    .font(.headline.bold())
                                    .foregroundStyle(.white)
                                Text(thread.project.title)
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.accent)
                                Text(thread.latest_message?.content ?? "Henüz mesaj yok")
                                    .font(.footnote)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(1)
                            }
                            .padding(.vertical, 6)
                        }
                        .listRowBackground(FoundrlyTheme.surface)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FoundrlyTheme.background)
            .navigationTitle("Mesajlar")
        } detail: {
            VStack(spacing: 0) {
                if let thread = viewModel.selectedThread {
                    ScrollView(showsIndicators: false) {
                        VStack(alignment: .leading, spacing: 14) {
                            NavigationLink {
                                PublicProfileView(viewModel: viewModel, userId: thread.counterpart.id)
                            } label: {
                                FoundrlySectionHeader(
                                    eyebrow: "Sohbet",
                                    title: thread.counterpart.full_name,
                                    subtitle: thread.project.title
                                )
                            }
                            .foundrlyCard()

                            ForEach(thread.messages) { item in
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(item.sender.full_name)
                                        .font(.caption.bold())
                                        .foregroundStyle(FoundrlyTheme.textMuted)
                                    Text(item.content)
                                        .foregroundStyle(.white)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .foundrlySoftCard()
                            }
                        }
                        .padding(20)
                        .padding(.bottom, 20)
                    }

                    HStack(spacing: 12) {
                        TextField("Mesajını yaz", text: $viewModel.messageDraft)
                            .padding()
                            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                        Button {
                            Task { await viewModel.sendMessage(session: session) }
                        } label: {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.system(size: 30))
                                .foregroundStyle(FoundrlyTheme.primaryBright)
                        }
                    }
                    .padding(20)
                } else {
                    ContentUnavailableView("Bir Sohbet Seç", systemImage: "message")
                }
            }
            .foundrlyScreen()
        }
    }
}
