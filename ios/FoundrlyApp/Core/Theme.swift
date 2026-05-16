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

extension View {
    func foundrlyCard() -> some View {
        modifier(FoundrlyCardModifier())
    }
}
