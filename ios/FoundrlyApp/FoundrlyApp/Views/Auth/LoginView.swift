import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AuthViewModel()
    let onSwitch: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            FoundrlySectionHeader(
                eyebrow: "Giriş",
                title: "Hesabına dön",
                subtitle: "Proje keşfi, AI eşleşmeleri ve topluluk alanın seni bekliyor."
            )

            field("E-posta", text: $viewModel.email, isSecure: false)
            field("Şifre", text: $viewModel.password, isSecure: true)

            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .font(.footnote)
                    .foregroundStyle(.red.opacity(0.92))
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(FoundrlyTheme.danger.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            }

            Button(viewModel.isLoading ? "Giriş yapılıyor..." : "Giriş Yap") {
                Task { await viewModel.login(session: session) }
            }
            .foundrlyPrimaryButton()

            Button("Hesabın yok mu? Kayıt ol", action: onSwitch)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(FoundrlyTheme.accent)
        }
        .foundrlyCard()
    }

    @ViewBuilder
    private func field(_ placeholder: String, text: Binding<String>, isSecure: Bool) -> some View {
        if isSecure {
            SecureField(placeholder, text: text)
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        } else {
            TextField(placeholder, text: text)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        }
    }
}
