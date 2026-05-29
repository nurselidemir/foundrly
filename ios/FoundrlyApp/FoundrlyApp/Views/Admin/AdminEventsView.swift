import SwiftUI

struct AdminEventsView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    
    @State private var showCreateSheet = false
    
    // Create event states
    @State private var title = ""
    @State private var description = ""
    @State private var location = ""
    @State private var eventDate = ""
    @State private var tag = ""
    @State private var isOnline = false

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
                            Text("Yeni Etkinlik Ekle")
                        }
                        .font(.subheadline.bold())
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    
                    if adminVM.events.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "calendar.badge.minus")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Etkinlik Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(adminVM.events) { event in
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Text(event.tag.uppercased())
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(FoundrlyTheme.accent.opacity(0.12))
                                        .clipShape(Capsule())
                                    
                                    Spacer()
                                    
                                    Button(role: .destructive) {
                                        Task {
                                            await adminVM.deleteEvent(session: session, eventId: event.id)
                                        }
                                    } label: {
                                        Image(systemName: "trash")
                                            .font(.footnote)
                                            .foregroundStyle(FoundrlyTheme.error)
                                    }
                                }
                                
                                Text(event.title)
                                    .font(.subheadline.bold())
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                Text(event.description)
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(2)
                                
                                Divider()
                                    .background(FoundrlyTheme.border)
                                
                                HStack {
                                    Label(event.event_date, systemImage: "calendar")
                                    Spacer()
                                    Label(event.location, systemImage: "location.fill")
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
        .navigationTitle("Etkinlik Yönetimi")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showCreateSheet) {
            ZStack {
                FoundrlyTheme.surface.ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 20) {
                        Text("Yeni Etkinlik")
                            .font(.headline)
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Etkinlik Başlığı")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: Demo Day 2026", text: $title)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Açıklama")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Etkinlik detayları...", text: $description, axis: .vertical)
                                    .textFieldStyle(.plain)
                                    .lineLimit(3...5)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Tarih")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: 15 Haziran 2026", text: $eventDate)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Konum")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: Zoom / Kolektif House", text: $location)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Kategori / Etiket")
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                TextField("Örn: Sunum / Workshop / Webinar", text: $tag)
                                    .textFieldStyle(.plain)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                    .foregroundStyle(.white)
                            }
                            
                            Toggle("Online Etkinlik", isOn: $isOnline)
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
                                        let req = CreateEventRequest(
                                            title: title,
                                            description: description,
                                            location: location,
                                            event_date: eventDate,
                                            tag: tag,
                                            is_online: isOnline
                                        )
                                        await adminVM.createEvent(session: session, request: req)
                                        showCreateSheet = false
                                        title = ""
                                        description = ""
                                        eventDate = ""
                                        location = ""
                                        tag = ""
                                        isOnline = false
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
