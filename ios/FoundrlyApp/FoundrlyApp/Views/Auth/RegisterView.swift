import SwiftUI

struct RegisterView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AuthViewModel()
    let onSwitch: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Kayıt Ol")
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundStyle(FoundrlyTheme.textPrimary)

            Group {
                TextField("Ad Soyad", text: $viewModel.fullName)
                TextField("Ünvan", text: $viewModel.title)
                TextField("E-posta", text: $viewModel.email)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                SecureField("Şifre", text: $viewModel.password)
                TextField("Kısa bio", text: $viewModel.bio, axis: .vertical)
                TextField("Yetenekler (virgülle)", text: $viewModel.skills)
                TextField("İlgi alanları (virgülle)", text: $viewModel.interests)
            }
            .padding()
            .background(FoundrlyTheme.surfaceRaised)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .font(.footnote)
                    .foregroundStyle(.red.opacity(0.92))
            }

            Button {
                Task { await viewModel.register(session: session) }
            } label: {
                Text(viewModel.isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(FoundrlyTheme.primary)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            }

            Button("Zaten hesabın var mı? Giriş yap", action: onSwitch)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(FoundrlyTheme.accent)
        }
        .foundrlyCard()
        .foregroundStyle(FoundrlyTheme.textPrimary)
    }
}
