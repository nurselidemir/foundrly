import SwiftUI

struct AdminGuidesView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    
    @State private var showCreateSheet = false
    
    // Create guide states
    @State private var title = ""
    @State private var read = ""
    @State private var tone = ""
    @State private var summary = ""
    @State private var bulletsString = ""
    @State private var isPublished = true

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    Button {
                        showCreateSheet = true
                    } label: {
                        HStack {
                            Image(systemName: "plus")
                            Text("Yeni Makale Ekle")
                        }
                        .font(.subheadline.bold())
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    
                    if adminVM.guides.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "book.closed")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Makale Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(adminVM.guides) { guide in
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Text(guide.tone.uppercased())
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(FoundrlyTheme.accent.opacity(0.12))
                                        .clipShape(Capsule())
                                    
                                    Spacer()
                                    
                                    Button(role: .destructive) {
                                        Task {
                                            await adminVM.deleteGuide(session: session, guideId: guide.id)
                                        }
                                    } label: {
                                        Image(systemName: "trash")
                                            .font(.footnote)
                                            .foregroundStyle(FoundrlyTheme.error)
                                    }
                                }
                                
                                Text(guide.title)
                                    .font(.subheadline.bold())
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                Text(guide.summary)
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(2)
                                
                                Divider()
                                    .background(FoundrlyTheme.border)
                                
                                HStack {
                                    Label(guide.read, systemImage: "clock")
                                    Spacer()
                                    Text(guide.is_published ? "YAYINDA" : "TASLAK")
                                        .font(.system(size: 9, weight: .black))
                                        .foregroundStyle(guide.is_published ? FoundrlyTheme.success : FoundrlyTheme.warning)
                                }
                                .font(.caption2)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            }
                            .foundrlyCard()
                        }
                    }
                    
                    if !adminVM.feedbackMessage.isEmpty {
                        Text(adminVM.feedbackMessage)
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(FoundrlyTheme.accent)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlyCard()
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Makale Yönetimi")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showCreateSheet) {
            ZStack {
                FoundrlyTheme.surface.ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 20) {
                        Text("Yeni Makale / Rehber")
                            .font(.headline)
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Makale Başlığı")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: Başarılı Pitch Deck Nasıl Hazırlanır?", text: $title)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Okuma Süresi")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: 5 dk okuma", text: $read)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Ton / Kategori")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: Profesyonel / Motive Edici", text: $tone)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Özet")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Kısa bir özet yazın...", text: $summary, axis: .vertical)
                                    .textFieldStyle(.plain)
                                    .lineLimit(3...4)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Maddeler (Virgülle ayırın)")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Madde 1, Madde 2, Madde 3", text: $bulletsString, axis: .vertical)
                                    .textFieldStyle(.plain)
                                    .lineLimit(3...4)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            Toggle("Doğrudan Yayınla", isOn: $isPublished)
                                .foregroundStyle(.white)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            
                            HStack(spacing: 16) {
                                Button("İptal") {
                                    showCreateSheet = false
                                }
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                
                                Button("Ekle") {
                                    Task {
                                        let bullets = bulletsString.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
                                        let req = CreateGuideRequest(
                                            title: title,
                                            read: read,
                                            tone: tone,
                                            summary: summary,
                                            bullets: bullets,
                                            is_published: isPublished
                                        )
                                        await adminVM.createGuide(session: session, request: req)
                                        showCreateSheet = false
                                        title = ""
                                        read = ""
                                        tone = ""
                                        summary = ""
                                        bulletsString = ""
                                        isPublished = true
                                    }
                                }
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.primary)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                    }
                    .padding(24)
                }
            }
        }
    }
}
