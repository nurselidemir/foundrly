import SwiftUI

struct MentorsView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    
    @State private var selectedMentor: MentorSummary?
    @State private var requestMessage = ""
    @State private var showRequestSheet = false
    
    // States for mentor responding to requests
    @State private var offerPrices: [Int: String] = [:]
    @State private var offerTimes: [Int: String] = [:]

    var sortedRequests: [MentorRequestSummary] {
        viewModel.mentorRequests.sorted { r1, r2 in
            let score1 = statusScore(r1.status)
            let score2 = statusScore(r2.status)
            return score1 > score2
        }
    }
    
    private func statusScore(_ status: String) -> Int {
        switch status {
        case "paid_reserved": return 10
        case "pending": return 9
        case "offered": return 8
        case "mentor_completed": return 7
        case "disputed": return 6
        case "released": return 5
        case "declined": return 4
        default: return 0
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 18) {
                        if session.currentUser?.is_mentor == true {
                            mentorPanel
                        } else {
                            mentorsMarketplace
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
            .navigationTitle(session.currentUser?.is_mentor == true ? "Mentör Paneli" : "Mentörler")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showRequestSheet) {
                if let mentor = selectedMentor {
                    ZStack {
                        FoundrlyTheme.surface.ignoresSafeArea()
                        VStack(spacing: 20) {
                            Text("Mentörlük Talebi")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            Text("\(mentor.full_name) isimli mentörden görüşme talep ediyorsunuz. Ücret: ₺\(Int(mentor.mentor_price))")
                                .font(.caption)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                            
                            TextField("Görüşmek istediğiniz konuyu detaylıca yazın...", text: $requestMessage, axis: .vertical)
                                .textFieldStyle(.plain)
                                .lineLimit(4...8)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .foregroundStyle(.white)
                            
                            HStack(spacing: 16) {
                                Button("İptal") {
                                    showRequestSheet = false
                                    requestMessage = ""
                                    selectedMentor = nil
                                }
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                
                                Button("Talebi Gönder") {
                                    Task {
                                        await viewModel.requestMentor(session: session, mentorId: mentor.id, message: requestMessage)
                                        showRequestSheet = false
                                        requestMessage = ""
                                        selectedMentor = nil
                                    }
                                }
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.primary)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                        .padding(24)
                    }
                    .presentationDetents([.medium])
                }
            }
        }
    }

    private var mentorsMarketplace: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Mentör Desteği")
                .font(.title2.bold())
                .foregroundStyle(FoundrlyTheme.textPrimary)

            if session.currentUser?.is_premium != true {
                VStack(spacing: 12) {
                    Image(systemName: "crown.fill")
                        .font(.title)
                        .foregroundStyle(FoundrlyTheme.accent)
                    
                    Text("Birebir Mentörlük Alın")
                        .font(.headline)
                    
                    Text("Mentörlük sistemine erişebilmek ve alanında uzman kişilerden destek almak için Premium üye olmalısınız.")
                        .font(.caption)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                        .multilineTextAlignment(.center)
                    
                    NavigationLink {
                        PremiumView(viewModel: viewModel)
                    } label: {
                        Text("Premium'a Yükselt")
                            .font(.subheadline.bold())
                            .foregroundStyle(.black)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 10)
                            .background(FoundrlyTheme.accent)
                            .clipShape(Capsule())
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(24)
                .foundrlyCard()
            } else {
                if viewModel.mentors.isEmpty {
                    Text("Şu an aktif mentör bulunmuyor.")
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                } else {
                    ForEach(viewModel.mentors) { mentor in
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 12) {
                                Image(systemName: "person.circle.fill")
                                    .font(.system(size: 40))
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
                                
                                Button {
                                    selectedMentor = mentor
                                    showRequestSheet = true
                                } label: {
                                    Text("Talep Et")
                                        .font(.caption.bold())
                                        .foregroundStyle(.white)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 8)
                                        .background(FoundrlyTheme.primary)
                                        .clipShape(Capsule())
                                }
                            }
                            
                            Text(mentor.bio)
                                .font(.caption)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .lineLimit(2)
                            
                            HStack {
                                Text("Görüşme Ücreti:")
                                    .font(.caption2)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                Text("₺\(Int(mentor.mentor_price)) / görüşme")
                                    .font(.caption.bold())
                                    .foregroundStyle(FoundrlyTheme.accent)
                            }
                        }
                        .foundrlyCard()
                    }
                }
            }
        }
    }

    private var mentorPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Balance / Price summary
            HStack(spacing: 14) {
                statPill("Cüzdan", "₺\(Int(session.currentUser?.mentor_balance ?? 0))")
                statPill("Görüşme Ücreti", "₺\(Int(session.currentUser?.mentor_price ?? 0))")
            }
            .frame(maxWidth: .infinity)
            
            Text("Mentörlük Talepleri")
                .font(.title2.bold())
                .foregroundStyle(FoundrlyTheme.textPrimary)

            if sortedRequests.isEmpty {
                Text("Henüz bir talep almadınız.")
                    .font(.subheadline)
                    .foregroundStyle(FoundrlyTheme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding()
            } else {
                ForEach(sortedRequests) { request in
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(request.user_details?.full_name ?? "Üye")
                                .font(.subheadline.bold())
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            Spacer()
                            
                            FoundrlyStatusBadge(status: request.status)
                        }
                        
                        Text(request.message)
                            .font(.caption)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        
                        // Meeting time and price information
                        if let mt = request.meeting_time {
                            HStack {
                                Label(mt, systemImage: "clock")
                                Spacer()
                                Text("Ücret: ₺\(Int(request.offered_price))")
                                    .font(.caption.bold())
                            }
                            .font(.caption2)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                        
                        // Status specific UIs
                        if request.status == "pending" {
                            VStack(spacing: 10) {
                                TextField("Önerilen Tarih/Saat (Örn: 15 Haziran 14:00)", text: Binding(
                                    get: { offerTimes[request.id, default: ""] },
                                    set: { offerTimes[request.id] = $0 }
                                ))
                                .textFieldStyle(.plain)
                                .padding(10)
                                .background(FoundrlyTheme.surface)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .foregroundStyle(.white)
                                .font(.caption)
                                
                                TextField("Önerilen Ücret (Boş bırakılırsa standart fiyat: ₺\(Int(session.currentUser?.mentor_price ?? 0)))", text: Binding(
                                    get: { offerPrices[request.id, default: ""] },
                                    set: { offerPrices[request.id] = $0 }
                                ))
                                .textFieldStyle(.plain)
                                .padding(10)
                                .background(FoundrlyTheme.surface)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .foregroundStyle(.white)
                                .font(.caption)
                                .keyboardType(.numberPad)
                                
                                HStack(spacing: 12) {
                                    Button {
                                        Task {
                                            let price = Double(offerPrices[request.id] ?? "")
                                            let time = offerTimes[request.id] ?? "Belirlenmedi"
                                            await viewModel.mentorAction(
                                                session: session,
                                                requestId: request.id,
                                                action: "offer",
                                                offeredPrice: price,
                                                meetingTime: time
                                            )
                                        }
                                    } label: {
                                        Text("Zaman ve Ücret Öner")
                                            .font(.caption.bold())
                                            .foregroundStyle(.white)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.primary)
                                            .clipShape(Capsule())
                                    }
                                    
                                    Button {
                                        Task {
                                            await viewModel.mentorAction(
                                                session: session,
                                                requestId: request.id,
                                                action: "decline"
                                            )
                                        }
                                    } label: {
                                        Text("Reddet")
                                            .font(.caption.bold())
                                            .foregroundStyle(FoundrlyTheme.error)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.error.opacity(0.12))
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                            .padding(.top, 4)
                        } else if request.status == "offered" {
                            Text("Zaman ve ücret önerildi. Kullanıcı onayı ve ödemesi bekleniyor.")
                                .font(.caption2.italic())
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        } else if request.status == "paid_reserved" {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Görüşme Ödemesi Güvence Altında!")
                                    .font(.caption2.bold())
                                    .foregroundStyle(FoundrlyTheme.accent)
                                
                                Button {
                                    Task {
                                        await viewModel.mentorAction(
                                            session: session,
                                            requestId: request.id,
                                            action: "mark_completed"
                                        )
                                    }
                                } label: {
                                    Text("Görüşmeyi Tamamlandı Olarak İşaretle")
                                        .font(.caption.bold())
                                        .foregroundStyle(.white)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(FoundrlyTheme.accent)
                                        .clipShape(Capsule())
                                }
                            }
                            .padding(10)
                            .background(FoundrlyTheme.accent.opacity(0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(FoundrlyTheme.accent.opacity(0.3), lineWidth: 1)
                            )
                        } else if request.status == "mentor_completed" {
                            Text("Görüşmeyi tamamlandı olarak işaretlediniz. Kullanıcı onayı (veya itirazı) bekleniyor. Ödeme onaylandığında hesabınıza geçecektir.")
                                .font(.caption2.italic())
                                .foregroundStyle(FoundrlyTheme.accent)
                        } else if request.status == "released" {
                            Text("Görüşme başarıyla tamamlandı ve ücret serbest bırakılarak hesabınıza aktarıldı ✓")
                                .font(.caption2.bold())
                                .foregroundStyle(FoundrlyTheme.accent)
                        } else if request.status == "disputed" {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Kullanıcı Tarafından İtiraz Açıldı")
                                    .font(.caption2.bold())
                                    .foregroundStyle(FoundrlyTheme.error)
                                if let reason = request.dispute_reason {
                                    Text("Nedeni: \(reason)")
                                        .font(.system(size: 10))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                            }
                            .padding(8)
                            .background(FoundrlyTheme.error.opacity(0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(FoundrlyTheme.surfaceRaised)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
            }
        }
    }

    private func statPill(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption.bold())
                .foregroundStyle(FoundrlyTheme.textSecondary)
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(.white)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(FoundrlyTheme.surfaceRaised)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
