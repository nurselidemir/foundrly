import SwiftUI

struct AdminMentorsView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    
    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    if adminVM.mentors.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "signature")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Mentör Kaydı Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(adminVM.mentors) { mentor in
                            VStack(alignment: .leading, spacing: 12) {
                                HStack(spacing: 12) {
                                    Image(systemName: "person.circle.fill")
                                        .font(.system(size: 36))
                                        .foregroundStyle(FoundrlyTheme.primary)
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(mentor.full_name)
                                            .font(.subheadline.bold())
                                            .foregroundStyle(FoundrlyTheme.textPrimary)
                                        Text(mentor.title)
                                            .font(.caption2)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                    }
                                    
                                    Spacer()
                                    
                                    Text("₺\(Int(mentor.mentor_price)) / Görüşme")
                                        .font(.caption.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(FoundrlyTheme.accent.opacity(0.12))
                                        .clipShape(Capsule())
                                }
                                
                                Text(mentor.bio)
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(2)
                                
                                if !mentor.skills.isEmpty {
                                    Divider()
                                        .background(FoundrlyTheme.border)
                                    
                                    FlowLayout(items: mentor.skills) { skill in
                                        Text(skill)
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundStyle(FoundrlyTheme.primary)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(FoundrlyTheme.primary.opacity(0.12))
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                            .foundrlyCard()
                        }
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Mentör Yönetimi")
        .navigationBarTitleDisplayMode(.inline)
    }
}
