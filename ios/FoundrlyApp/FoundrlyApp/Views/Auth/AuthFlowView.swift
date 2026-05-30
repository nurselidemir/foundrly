import SwiftUI

struct AuthFlowView: View {
    @State private var isRegistering = false
    private let highlights: [(title: String, body: String)] = [
        ("Takımını daha hızlı kur", "Kurucular, geliştiriciler ve tasarımcılar aynı ürün içinde buluşur."),
        ("AI ile daha doğru eşleş", "Premium üyeler için uyum skoru ve proje bazlı aday önerileri hazır."),
        ("Toplulukta görünür ol", "Hackathonlar, proje ekipleri ve mesajlaşma akışıyla daha güçlü ilerle.")
    ]

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 22) {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Foundrly")
                            .font(.system(size: 38, weight: .black, design: .rounded))
                            .foregroundStyle(FoundrlyTheme.textPrimary)

                        Text("Doğru insanları bul, ekibini kur ve fikrini ürüne dönüştür.")
                            .font(.title3.weight(.medium))
                            .foregroundStyle(FoundrlyTheme.textSecondary)

                        HStack(spacing: 12) {
                            heroMetric("AI eşleşme", "Premium")
                            heroMetric("Topluluk", "Canlı")
                            heroMetric("Proje akışı", "Hazır")
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()

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
                            .frame(maxWidth: .infinity, minHeight: 146, alignment: .leading)
                            .foundrlyCard()
                            .padding(.horizontal, 2)
                        }
                    }
                    .tabViewStyle(.page(indexDisplayMode: .always))
                    .frame(height: 200)

                    if isRegistering {
                        RegisterView(onSwitch: { isRegistering = false })
                    } else {
                        LoginView(onSwitch: { isRegistering = true })
                    }
                }
                .padding(20)
                .padding(.bottom, 40)
            }
            .foundrlyScreen()
        }
    }

    private func heroMetric(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(.caption.weight(.bold))
                .foregroundStyle(FoundrlyTheme.textMuted)
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
