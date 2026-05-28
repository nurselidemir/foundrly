import SwiftUI

struct AuthFlowView: View {
    @State private var isRegistering = false
    private let highlights: [(title: String, body: String)] = [
        ("Takımını daha hızlı kur", "Kurucular, geliştiriciler ve tasarımcılar aynı ürün içinde buluşur."),
        ("AI ile daha doğru eşleş", "Premium üyeler için uyum skoru ve proje bazlı aday önerileri hazır."),
        ("Toplulukta görünür ol", "Hackathonlar, mentörler ve verified talent akışıyla daha güçlü ilerle.")
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyTheme.background.ignoresSafeArea()
                Circle()
                    .fill(FoundrlyTheme.primary.opacity(0.22))
                    .frame(width: 220, height: 220)
                    .blur(radius: 80)
                    .offset(x: -140, y: -250)
                Circle()
                    .fill(FoundrlyTheme.accent.opacity(0.18))
                    .frame(width: 200, height: 200)
                    .blur(radius: 90)
                    .offset(x: 150, y: 260)

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

                        TabView {
                            ForEach(highlights, id: \.title) { item in
                                VStack(alignment: .leading, spacing: 12) {
                                    Text(item.title)
                                        .font(.title3.bold())
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    Text(item.body)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        .font(.subheadline)
                                }
                                .frame(maxWidth: .infinity, minHeight: 132, alignment: .leading)
                                .foundrlyCard()
                                .padding(.horizontal, 2)
                            }
                        }
                        .tabViewStyle(.page(indexDisplayMode: .always))
                        .frame(height: 190)

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
