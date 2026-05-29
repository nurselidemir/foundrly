import SwiftUI

struct HubView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    
    @State private var expandedGuides: Set<Int> = []

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Girişim Merkezi")
                            .font(.title2.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        Text("Girişimcilik ve iş geliştirme konularında uzman makaleleri, rehberleri ve tüyoları takip edin.")
                            .font(.footnote)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    if viewModel.guides.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "book.closed")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Rehber Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(viewModel.guides) { guide in
                            VStack(alignment: .leading, spacing: 14) {
                                HStack {
                                    Text(guide.tone.uppercased())
                                        .font(.system(size: 10, weight: .black))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(FoundrlyTheme.accent.opacity(0.18))
                                        .clipShape(Capsule())
                                    
                                    Spacer()
                                    
                                    HStack(spacing: 4) {
                                        Image(systemName: "clock")
                                        Text(guide.read)
                                    }
                                    .font(.caption2.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                                
                                Text(guide.title)
                                    .font(.title3.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                Text(guide.summary)
                                    .font(.subheadline)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                
                                let isExpanded = expandedGuides.contains(guide.id)
                                
                                if isExpanded {
                                    VStack(alignment: .leading, spacing: 8) {
                                        Text("Önemli Çıkarımlar:")
                                            .font(.caption.weight(.bold))
                                            .foregroundStyle(FoundrlyTheme.primary)
                                            .padding(.top, 6)
                                        
                                        ForEach(guide.bullets, id: \.self) { bullet in
                                            HStack(alignment: .top, spacing: 8) {
                                                Image(systemName: "circle.fill")
                                                    .font(.system(size: 6))
                                                    .foregroundStyle(FoundrlyTheme.primary)
                                                    .padding(.top, 6)
                                                Text(bullet)
                                                    .font(.footnote)
                                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                            }
                                        }
                                    }
                                    .transition(.opacity.combined(with: .move(edge: .top)))
                                }
                                
                                Button {
                                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                        if isExpanded {
                                            expandedGuides.remove(guide.id)
                                        } else {
                                            expandedGuides.insert(guide.id)
                                        }
                                    }
                                } label: {
                                    HStack(spacing: 6) {
                                        Text(isExpanded ? "Daha Az Göster" : "Detayları Göster")
                                        Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                                    }
                                    .font(.footnote.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.primary)
                                }
                                .padding(.top, 4)
                            }
                            .foundrlyCard()
                        }
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Girişim Merkezi")
        .navigationBarTitleDisplayMode(.inline)
    }
}
