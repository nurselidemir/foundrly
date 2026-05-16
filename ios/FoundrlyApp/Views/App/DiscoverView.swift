import SwiftUI

struct DiscoverView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedProjectId: Int?
    @State private var applyMessage = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    ForEach(viewModel.projects) { project in
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(project.title)
                                        .font(.title3.bold())
                                    NavigationLink {
                                        PublicProfileView(viewModel: viewModel, userId: project.owner.id)
                                    } label: {
                                        Text(project.owner.full_name + " · " + project.owner.title)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .font(.subheadline)
                                    }
                                }
                                Spacer()
                                if project.is_premium_highlighted {
                                    Text("Premium")
                                        .font(.caption.bold())
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(FoundrlyTheme.primary.opacity(0.18))
                                        .clipShape(Capsule())
                                }
                            }

                            Text(project.summary)
                                .foregroundStyle(FoundrlyTheme.textSecondary)

                            if selectedProjectId == project.id {
                                TextField("Bu projeye neden uygunsun?", text: $applyMessage, axis: .vertical)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                                HStack {
                                    Button("Başvur") {
                                        Task {
                                            await viewModel.apply(session: session, projectId: project.id, message: applyMessage)
                                            applyMessage = ""
                                            selectedProjectId = nil
                                        }
                                    }
                                    .fontWeight(.bold)
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 12)
                                    .background(FoundrlyTheme.primary)
                                    .foregroundStyle(.white)
                                    .clipShape(Capsule())

                                    Button("Vazgeç") {
                                        selectedProjectId = nil
                                        applyMessage = ""
                                    }
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 12)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(Capsule())
                                }
                            } else {
                                Button("Projeye Başvur") {
                                    selectedProjectId = project.id
                                }
                                .fontWeight(.bold)
                                .padding(.horizontal, 18)
                                .padding(.vertical, 12)
                                .background(FoundrlyTheme.primary)
                                .foregroundStyle(.white)
                                .clipShape(Capsule())
                            }
                        }
                        .foundrlyCard()
                    }
                }
                .padding(20)
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Keşfet")
        }
    }
}
