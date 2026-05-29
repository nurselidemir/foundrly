import SwiftUI

enum FoundrlyTheme {
    static let background = Color(red: 11 / 255, green: 16 / 255, blue: 32 / 255)
    static let surface = Color(red: 18 / 255, green: 26 / 255, blue: 47 / 255)
    static let surfaceRaised = Color(red: 26 / 255, green: 37 / 255, blue: 67 / 255)
    static let primary = Color(red: 91 / 255, green: 127 / 255, blue: 1)
    static let accent = Color(red: 57 / 255, green: 217 / 255, blue: 138 / 255)
    static let textPrimary = Color.white
    static let textSecondary = Color.white.opacity(0.7)
    static let border = Color.white.opacity(0.08)
    static let glow = Color(red: 91 / 255, green: 127 / 255, blue: 1).opacity(0.24)

    // Status colors
    static let success = Color(red: 63/255, green: 177/255, blue: 112/255)
    static let warning = Color(red: 255/255, green: 183/255, blue: 77/255)
    static let error = Color(red: 239/255, green: 83/255, blue: 80/255)
    static let info = Color(red: 100/255, green: 181/255, blue: 246/255)
    static let danger = Color(red: 239/255, green: 83/255, blue: 80/255)
    
    static let surfaceSoft = Color(red: 22 / 255, green: 32 / 255, blue: 59 / 255)
    static let textMuted = Color.white.opacity(0.5)

    static func statusColor(for status: String) -> Color {
        switch status.lowercased() {
        case "pending", "bekliyor":
            return warning
        case "offered", "teklif":
            return info
        case "paid_reserved", "odeme_alindi":
            return primary
        case "mentor_completed", "tamamlandi_bekliyor":
            return info
        case "released", "kabul edildi", "accepted":
            return success
        case "disputed", "itiraz":
            return error
        case "declined", "reddedildi", "rejected":
            return error
        case "refunded", "iade edildi":
            return error
        default:
            return textSecondary
        }
    }

    static func statusLabel(for status: String) -> String {
        switch status.lowercased() {
        case "pending": return "Onay Bekleniyor"
        case "offered": return "Teklif Yapıldı"
        case "paid_reserved": return "Ödeme Rezerve Edildi"
        case "mentor_completed": return "Görüşme Tamamlandı"
        case "released": return "Ödeme Serbest Bırakıldı"
        case "disputed": return "İtiraz Açıldı"
        case "declined": return "Reddedildi"
        case "refunded": return "İade Edildi"
        case "accepted": return "Kabul Edildi"
        case "rejected": return "Reddedildi"
        default: return status
        }
    }
}

struct FoundrlyCardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(20)
            .background(FoundrlyTheme.surface.opacity(0.88))
            .overlay(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(FoundrlyTheme.border, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .shadow(color: FoundrlyTheme.glow, radius: 24, x: 0, y: 14)
    }
}

struct FoundrlyPrimaryButtonModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.headline.weight(.semibold))
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                LinearGradient(
                    colors: [FoundrlyTheme.primary, FoundrlyTheme.primary.opacity(0.8)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .shadow(color: FoundrlyTheme.primary.opacity(0.3), radius: 10, x: 0, y: 4)
    }
}

struct FoundrlyScreenModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                FoundrlyBackground()
            )
    }
}

extension View {
    func foundrlyCard() -> some View {
        modifier(FoundrlyCardModifier())
    }
    
    func foundrlyPrimaryButton() -> some View {
        modifier(FoundrlyPrimaryButtonModifier())
    }
    
    func foundrlyScreen() -> some View {
        modifier(FoundrlyScreenModifier())
    }
}

struct FoundrlyBackground: View {
    var body: some View {
        ZStack {
            FoundrlyTheme.background.ignoresSafeArea()
            
            // Neon soft blobs for premium glassmorphism feel
            GeometryReader { geo in
                ZStack {
                    RadialGradient(colors: [FoundrlyTheme.primary.opacity(0.12), .clear], center: .center, startRadius: 0, endRadius: geo.size.width * 0.5)
                        .frame(width: geo.size.width, height: geo.size.width)
                        .position(x: geo.size.width * 0.2, y: geo.size.height * 0.15)
                    
                    RadialGradient(colors: [FoundrlyTheme.accent.opacity(0.08), .clear], center: .center, startRadius: 0, endRadius: geo.size.width * 0.6)
                        .frame(width: geo.size.width * 1.2, height: geo.size.width * 1.2)
                        .position(x: geo.size.width * 0.8, y: geo.size.height * 0.8)
                }
            }
        }
    }
}

struct FoundrlyStatusBadge: View {
    let status: String
    
    var body: some View {
        Text(FoundrlyTheme.statusLabel(for: status))
            .font(.caption.weight(.bold))
            .foregroundStyle(FoundrlyTheme.statusColor(for: status))
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(FoundrlyTheme.statusColor(for: status).opacity(0.12))
            .clipShape(Capsule())
    }
}

struct FoundrlySectionHeader: View {
    let eyebrow: String
    let title: String
    let subtitle: String?
    
    init(eyebrow: String, title: String, subtitle: String? = nil) {
        self.eyebrow = eyebrow
        self.title = title
        self.subtitle = subtitle
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(eyebrow.uppercased())
                .font(.caption.weight(.bold))
                .tracking(1.5)
                .foregroundStyle(FoundrlyTheme.accent)
            
            Text(title)
                .font(.title2.bold())
                .foregroundStyle(FoundrlyTheme.textPrimary)
            
            if let subtitle {
                Text(subtitle)
                    .font(.footnote)
                    .foregroundStyle(FoundrlyTheme.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}
