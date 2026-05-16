import SwiftUI

struct AuthFlowView: View {
    @State private var isRegistering = false

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyTheme.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        VStack(spacing: 12) {
                            Text("Foundrly")
                                .font(.system(size: 36, weight: .black, design: .rounded))
                                .foregroundStyle(FoundrlyTheme.textPrimary)

                            Text("Dogru insanlari bul, ekibini kur ve fikrini urune donustur.")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 24)
                        }
                        .padding(.top, 40)

                        if isRegistering {
                            RegisterView(onSwitch: { isRegistering = false })
                        } else {
                            LoginView(onSwitch: { isRegistering = true })
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }
        }
    }
}
