import SwiftUI

struct CreateProjectView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    @State private var title = ""
    @State private var summary = ""
    @State private var problemStatement = ""
    @State private var techStack = ""
    @State private var neededRoles = ""

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Yeni Bir Proje Başlat")
                                .font(.title2.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            Text("Fikrini hayata geçirmek için ekip arkadaşlarını bul ve topluluğa duyur.")
                                .font(.footnote)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                        
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Proje Başlığı")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: E-Ticaret Girişimi", text: $title)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Kısa Özet")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Projenin amacını kısaca açıkla...", text: $summary, axis: .vertical)
                                    .textFieldStyle(.plain)
                                    .lineLimit(2...4)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Problem Tanımı")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Bu proje hangi problemi çözüyor?", text: $problemStatement, axis: .vertical)
                                    .textFieldStyle(.plain)
                                    .lineLimit(3...5)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Teknolojiler (Virgülle ayır)")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Swift, Django, PostgreSQL", text: $techStack)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Aranan Roller (Virgülle ayır)")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("iOS Geliştirici, UI Tasarımcısı", text: $neededRoles)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .foregroundStyle(.white)
                            }
                            
                            Button {
                                Task {
                                    let stack = techStack.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
                                    let roles = neededRoles.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
                                    let req = CreateProjectRequest(
                                        title: title,
                                        summary: summary,
                                        problem_statement: problemStatement,
                                        tech_stack: stack,
                                        needed_roles: roles
                                    )
                                    await viewModel.createProject(session: session, request: req)
                                    
                                    // Clear fields on success
                                    title = ""
                                    summary = ""
                                    problemStatement = ""
                                    techStack = ""
                                    neededRoles = ""
                                }
                            } label: {
                                Text("Projeyi Oluştur")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(FoundrlyTheme.primary)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                    .shadow(color: FoundrlyTheme.primary.opacity(0.3), radius: 10, y: 5)
                            }
                            .padding(.top, 10)
                        }
                        .foundrlyCard()
                        
                        if !viewModel.feedbackMessage.isEmpty {
                            Text(viewModel.feedbackMessage)
                                .font(.footnote.weight(.semibold))
                                .foregroundStyle(FoundrlyTheme.accent)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .foundrlyCard()
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Proje Oluştur")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
