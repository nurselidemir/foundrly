import SwiftUI

struct RegisterView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AuthViewModel()
    let onSwitch: () -> Void

    @State private var selectedRoleIndex = 0
    let roles = ["Founder", "Developer", "Designer", "Mentor"]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            FoundrlySectionHeader(
                eyebrow: "Kayıt",
                title: "Profilini kur",
                subtitle: "Eşleşme mantığı bu bilgiler üzerinden çalışacak; o yüzden güçlü ve net bir başlangıç yap."
            )

            Group {
                input("Ad Soyad", text: $viewModel.fullName)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Foundrly Rolü")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                    
                    HStack(spacing: 8) {
                        ForEach(0..<roles.count, id: \.self) { index in
                            Button {
                                selectedRoleIndex = index
                                viewModel.title = roles[index]
                            } label: {
                                Text(roles[index])
                                    .font(.system(size: 12, weight: .bold))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedRoleIndex == index ? FoundrlyTheme.primary : FoundrlyTheme.surfaceSoft.opacity(0.5))
                                    .foregroundStyle(selectedRoleIndex == index ? .white : FoundrlyTheme.textSecondary)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }
                .padding(.vertical, 4)
                
                input("Detaylı Ünvan (örn. iOS Geliştirici)", text: $viewModel.title)
                input("E-posta", text: $viewModel.email, autoCaps: false)
                secureInput("Şifre", text: $viewModel.password)
                input("Kısa bio", text: $viewModel.bio)
                input("Yetenekler (virgülle)", text: $viewModel.skills)
                input("İlgi alanları (virgülle)", text: $viewModel.interests)
            }

            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .font(.footnote)
                    .foregroundStyle(.red.opacity(0.92))
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(FoundrlyTheme.danger.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }

            Button(viewModel.isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur") {
                if viewModel.title.isEmpty {
                    viewModel.title = roles[selectedRoleIndex]
                }
                Task { await viewModel.register(session: session) }
            }
            .foundrlyPrimaryButton()

            Button("Zaten hesabın var mı? Giriş yap", action: onSwitch)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(FoundrlyTheme.accent)
        }
        .foundrlyCard()
        .onAppear {
            viewModel.title = roles[selectedRoleIndex]
        }
    }

    private func input(_ placeholder: String, text: Binding<String>, autoCaps: Bool = true) -> some View {
        TextField(placeholder, text: text, axis: .vertical)
            .textInputAutocapitalization(autoCaps ? .sentences : .never)
            .autocorrectionDisabled(!autoCaps)
            .padding()
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private func secureInput(_ placeholder: String, text: Binding<String>) -> some View {
        SecureField(placeholder, text: text)
            .padding()
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
