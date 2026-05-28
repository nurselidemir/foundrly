import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AuthViewModel()
    let onSwitch: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text("Giriş Yap")
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundStyle(FoundrlyTheme.textPrimary)

            TextField("E-posta", text: $viewModel.email)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding()
                .background(FoundrlyTheme.surfaceRaised)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            SecureField("Şifre", text: $viewModel.password)
                .padding()
                .background(FoundrlyTheme.surfaceRaised)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .font(.footnote)
                    .foregroundStyle(.red.opacity(0.92))
            }

            Button {
                Task { await viewModel.login(session: session) }
            } label: {
                Text(viewModel.isLoading ? "Giriş yapılıyor..." : "Giriş Yap")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(FoundrlyTheme.primary)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            }

            Button("Hesabın yok mu? Kayıt ol", action: onSwitch)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(FoundrlyTheme.accent)
        }
        .foundrlyCard()
        .foregroundStyle(FoundrlyTheme.textPrimary)
    }
}
