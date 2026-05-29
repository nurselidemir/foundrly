import SwiftUI

struct EventsView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    if viewModel.events.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "calendar.badge.exclamationmark")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Yaklaşan Etkinlik Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            Text("Topluluk etkinlikleri yakında burada listelenecektir.")
                                .font(.footnote)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(viewModel.events) { event in
                            VStack(alignment: .leading, spacing: 14) {
                                HStack {
                                    Text(event.tag.uppercased())
                                        .font(.system(size: 10, weight: .black))
                                        .foregroundStyle(FoundrlyTheme.primary)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(FoundrlyTheme.primary.opacity(0.18))
                                        .clipShape(Capsule())
                                    
                                    Spacer()
                                    
                                    HStack(spacing: 4) {
                                        Image(systemName: event.is_online ? "globe" : "mappin.circle.fill")
                                        Text(event.is_online ? "Online" : "Fiziksel")
                                    }
                                    .font(.caption2.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.accent)
                                }
                                
                                Text(event.title)
                                    .font(.title3.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                Text(event.description)
                                    .font(.subheadline)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(3)
                                
                                Divider()
                                    .background(FoundrlyTheme.border)
                                
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        HStack(spacing: 6) {
                                            Image(systemName: "calendar")
                                            Text(event.event_date)
                                        }
                                        .font(.caption.weight(.semibold))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        
                                        HStack(spacing: 6) {
                                            Image(systemName: "location.fill")
                                            Text(event.location)
                                        }
                                        .font(.caption.weight(.semibold))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    }
                                    
                                    Spacer()
                                    
                                    if event.is_registered == true {
                                        HStack(spacing: 4) {
                                            Image(systemName: "checkmark.circle.fill")
                                            Text("Kayıt Alındı ✓")
                                        }
                                        .font(.subheadline.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(FoundrlyTheme.accent.opacity(0.12))
                                        .clipShape(Capsule())
                                    } else {
                                        Button {
                                            Task {
                                                await viewModel.registerEvent(session: session, eventId: event.id)
                                            }
                                        } label: {
                                            Text("Kayıt Ol")
                                                .font(.subheadline.weight(.bold))
                                                .foregroundStyle(.white)
                                                .padding(.horizontal, 20)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.primary)
                                                .clipShape(Capsule())
                                        }
                                    }
                                }
                            }
                            .foundrlyCard()
                        }
                    }
                    
                    if !viewModel.feedbackMessage.isEmpty {
                        Text(viewModel.feedbackMessage)
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(FoundrlyTheme.accent)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlyCard()
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Etkinlikler")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadEvents(session: session)
        }
    }
}
