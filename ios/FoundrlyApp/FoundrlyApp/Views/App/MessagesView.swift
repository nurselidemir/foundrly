import SwiftUI

struct MessagesView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        NavigationSplitView {
            List(viewModel.threads) { thread in
                Button {
                    Task { await viewModel.selectThread(session: session, applicationId: thread.application_id) }
                } label: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(thread.counterpart.full_name)
                            .font(.headline)
                        Text(thread.project.title)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text(thread.latest_message?.content ?? "Henüz mesaj yok")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
            }
            .navigationTitle("Mesajlar")
        } detail: {
            VStack {
                if let thread = viewModel.selectedThread {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 14) {
                            NavigationLink {
                                PublicProfileView(viewModel: viewModel, userId: thread.counterpart.id)
                            } label: {
                                Text(thread.counterpart.full_name)
                                    .font(.title2.bold())
                                    .foregroundStyle(.white)
                            }
                            ForEach(thread.messages) { item in
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(item.sender.full_name)
                                        .font(.caption.bold())
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    Text(item.content)
                                        .foregroundStyle(.white)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .foundrlyCard()
                            }
                        }
                        .padding(20)
                    }

                    HStack(spacing: 12) {
                        TextField("Mesajını yaz", text: $viewModel.messageDraft)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                        Button {
                            Task { await viewModel.sendMessage(session: session) }
                        } label: {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.system(size: 28))
                                .foregroundStyle(FoundrlyTheme.primary)
                        }
                    }
                    .padding(20)
                } else {
                    ContentUnavailableView("Henüz Konuşma Yok", systemImage: "message")
                }
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
        }
    }
}
