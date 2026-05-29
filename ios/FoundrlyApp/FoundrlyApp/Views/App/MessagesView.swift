import SwiftUI

struct MessagesView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                VStack(spacing: 0) {
                    if viewModel.threads.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "message.badge")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Henüz Mesajınız Yok")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            Text("Takım başvuruları onaylandığında burada konuşmalarınız listelenir.")
                                .font(.footnote)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                        .padding(20)
                    } else {
                        ScrollView {
                            LazyVStack(spacing: 14) {
                                ForEach(viewModel.threads) { thread in
                                    NavigationLink {
                                        MessageDetailView(viewModel: viewModel, applicationId: thread.application_id)
                                    } label: {
                                        HStack(spacing: 14) {
                                            let initials = thread.counterpart.full_name.split(separator: " ").compactMap { $0.first }.map { String($0) }.joined()
                                            Text(initials.uppercased())
                                                .font(.subheadline.weight(.black))
                                                .foregroundStyle(.white)
                                                .frame(width: 44, height: 44)
                                                .background(FoundrlyTheme.primary)
                                                .clipShape(Circle())
                                            
                                            VStack(alignment: .leading, spacing: 4) {
                                                Text(thread.counterpart.full_name)
                                                    .font(.subheadline.bold())
                                                    .foregroundStyle(.white)
                                                Text(thread.project.title)
                                                    .font(.caption2)
                                                    .foregroundStyle(FoundrlyTheme.accent)
                                                Text(thread.latest_message?.content ?? "Henüz mesaj yok")
                                                    .font(.caption)
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                                    .lineLimit(1)
                                            }
                                            
                                            Spacer()
                                            
                                            Image(systemName: "chevron.right")
                                                .font(.caption)
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                        }
                                        .foundrlyCard()
                                    }
                                }
                            }
                            .padding(20)
                        }
                    }
                }
            }
            .navigationTitle("Mesajlar")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct MessageDetailView: View {
    @ObservedObject var viewModel: AppShellViewModel
    @EnvironmentObject private var session: AppSession
    let applicationId: Int

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            VStack(spacing: 0) {
                if let thread = viewModel.selectedThread {
                    ScrollView {
                        VStack(spacing: 14) {
                            NavigationLink {
                                PublicProfileView(viewModel: viewModel, userId: thread.counterpart.id)
                            } label: {
                                HStack {
                                    Image(systemName: "person.crop.circle.fill")
                                        .font(.title3)
                                    Text(thread.counterpart.full_name)
                                        .font(.subheadline.bold())
                                    if thread.counterpart.is_verified_talent == true {
                                        Image(systemName: "checkmark.seal.fill")
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.accent)
                                    }
                                    Spacer()
                                }
                                .padding(.horizontal, 4)
                                .foregroundStyle(FoundrlyTheme.primary)
                            }
                            
                            ForEach(thread.messages) { item in
                                let isMe = item.sender.email == session.currentUser?.email
                                
                                HStack {
                                    if isMe { Spacer() }
                                    
                                    VStack(alignment: isMe ? .trailing : .leading, spacing: 4) {
                                        Text(item.sender.full_name)
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundStyle(isMe ? FoundrlyTheme.accent : FoundrlyTheme.primary)
                                        
                                        Text(item.content)
                                            .font(.footnote)
                                            .foregroundStyle(.white)
                                    }
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 10)
                                    .background(isMe ? FoundrlyTheme.surfaceRaised : FoundrlyTheme.surface)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                                            .stroke(isMe ? FoundrlyTheme.accent.opacity(0.2) : FoundrlyTheme.border, lineWidth: 1)
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                                    
                                    if !isMe { Spacer() }
                                }
                            }
                        }
                        .padding(20)
                    }
                    
                    HStack(spacing: 12) {
                        TextField("Mesajını yaz...", text: $viewModel.messageDraft)
                            .textFieldStyle(.plain)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                            .foregroundStyle(.white)
                        
                        Button {
                            Task {
                                await viewModel.sendMessage(session: session)
                            }
                        } label: {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.system(size: 32))
                                .foregroundStyle(FoundrlyTheme.primary)
                        }
                        .disabled(viewModel.messageDraft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    }
                    .padding(20)
                } else {
                    ProgressView()
                        .tint(.white)
                }
            }
        }
        .navigationTitle(viewModel.selectedThread?.project.title ?? "Konuşma")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.selectThread(session: session, applicationId: applicationId)
        }
    }
}
