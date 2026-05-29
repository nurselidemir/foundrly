import SwiftUI

struct RegisterView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AuthViewModel()
    let onSwitch: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            FoundrlySectionHeader(
                eyebrow: "Kayıt",
                title: "Profilini kur",
                subtitle: "Eşleşme mantığı bu bilgiler üzerinden çalışacak; o yüzden güçlü ve net bir başlangıç yap."
            )

            Group {
                input("Ad Soyad", text: $viewModel.fullName)
                input("Ünvan", text: $viewModel.title)
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
                Task { await viewModel.register(session: session) }
            }
            .foundrlyPrimaryButton()

            Button("Zaten hesabın var mı? Giriş yap", action: onSwitch)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(FoundrlyTheme.accent)
        }
        .foundrlyCard()
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
