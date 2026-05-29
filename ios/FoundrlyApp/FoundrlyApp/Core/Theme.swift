import SwiftUI

enum FoundrlyTheme {
    static let backgroundTop = Color(red: 8 / 255, green: 13 / 255, blue: 28 / 255)
    static let backgroundBottom = Color(red: 17 / 255, green: 27 / 255, blue: 55 / 255)
    static let surface = Color(red: 16 / 255, green: 24 / 255, blue: 48 / 255)
    static let surfaceRaised = Color(red: 24 / 255, green: 36 / 255, blue: 72 / 255)
    static let surfaceSoft = Color(red: 33 / 255, green: 47 / 255, blue: 88 / 255)
    static let primary = Color(red: 87 / 255, green: 116 / 255, blue: 1)
    static let primaryBright = Color(red: 109 / 255, green: 140 / 255, blue: 1)
    static let accent = Color(red: 61 / 255, green: 225 / 255, blue: 168 / 255)
    static let gold = Color(red: 244 / 255, green: 196 / 255, blue: 73 / 255)
    static let danger = Color(red: 1, green: 104 / 255, blue: 104 / 255)
    static let textPrimary = Color.white
    static let textSecondary = Color.white.opacity(0.72)
    static let textMuted = Color.white.opacity(0.54)
    static let border = Color.white.opacity(0.1)
    static let strongBorder = Color.white.opacity(0.18)
    static let glow = Color(red: 91 / 255, green: 127 / 255, blue: 1).opacity(0.22)
    static let accentGlow = Color(red: 61 / 255, green: 225 / 255, blue: 168 / 255).opacity(0.12)

    static var background: some View {
        LinearGradient(
            colors: [backgroundTop, backgroundBottom],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static var pageGlow: some View {
        ZStack {
            Circle()
                .fill(primary.opacity(0.28))
                .frame(width: 280, height: 280)
                .blur(radius: 90)
                .offset(x: -110, y: -260)

            Circle()
                .fill(accentGlow)
                .frame(width: 240, height: 240)
                .blur(radius: 95)
                .offset(x: 150, y: 220)
        }
        .allowsHitTesting(false)
    }
}

private struct FoundrlyCardModifier: ViewModifier {
    let fill: Color
    let radius: CGFloat

    func body(content: Content) -> some View {
        content
            .padding(20)
            .background(fill.opacity(0.9))
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .stroke(FoundrlyTheme.border, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
            .shadow(color: FoundrlyTheme.glow, radius: 24, x: 0, y: 16)
    }
}

private struct FoundrlyPrimaryButtonModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.headline.weight(.bold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                LinearGradient(
                    colors: [FoundrlyTheme.primaryBright, FoundrlyTheme.primary],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .shadow(color: FoundrlyTheme.glow, radius: 18, x: 0, y: 12)
    }
}

private struct FoundrlySecondaryButtonModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.headline.weight(.semibold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .foregroundStyle(FoundrlyTheme.textPrimary)
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(FoundrlyTheme.border, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}

extension View {
    func foundrlyCard() -> some View {
        modifier(FoundrlyCardModifier(fill: FoundrlyTheme.surface, radius: 26))
    }

    func foundrlySoftCard() -> some View {
        modifier(FoundrlyCardModifier(fill: FoundrlyTheme.surfaceRaised, radius: 22))
    }

    func foundrlyPrimaryButton() -> some View {
        modifier(FoundrlyPrimaryButtonModifier())
    }

    func foundrlySecondaryButton() -> some View {
        modifier(FoundrlySecondaryButtonModifier())
    }

    func foundrlyScreen() -> some View {
        self
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .overlay(FoundrlyTheme.pageGlow)
    }
}

struct FoundrlySectionHeader: View {
    let eyebrow: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(eyebrow.uppercased())
                .font(.caption.weight(.bold))
                .tracking(1.1)
                .foregroundStyle(FoundrlyTheme.accent)

            Text(title)
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundStyle(FoundrlyTheme.textPrimary)

            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct FoundrlyPill: View {
    let title: String
    let tint: Color
    var textColor: Color = .white

    var body: some View {
        Text(title)
            .font(.caption.bold())
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(tint)
            .foregroundStyle(textColor)
            .clipShape(Capsule())
    }
}
