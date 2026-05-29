import SwiftUI

struct MentorshipUserView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    
    @State private var showDisputeSheet = false
    @State private var disputeReason = ""
    @State private var selectedRequestId: Int?

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    if viewModel.myMentorRequests.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "person.2.wave.2")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Mentörlük Talebiniz Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            Text("Premium üye olarak Keşfet veya Mentörler bölümünden dilediğiniz mentöre görüşme talebi gönderebilirsiniz.")
                                .font(.footnote)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        // Section 1: offered status
                        let offered = viewModel.myMentorRequests.filter { $0.status == "offered" }
                        if !offered.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Onay Bekleyen Teklifler")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                ForEach(offered) { req in
                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(req.mentor_details?.full_name ?? "Mentör")
                                            .font(.subheadline.bold())
                                            .foregroundStyle(FoundrlyTheme.textPrimary)
                                        
                                        HStack {
                                            Label(req.meeting_time ?? "Belirtilmedi", systemImage: "clock")
                                            Spacer()
                                            Text("₺\(Int(req.offered_price))")
                                                .font(.headline.bold())
                                                .foregroundStyle(FoundrlyTheme.accent)
                                        }
                                        .font(.footnote)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        
                                        Button {
                                            Task {
                                                await viewModel.userConfirmMentor(session: session, requestId: req.id, action: "accept_offer")
                                            }
                                        } label: {
                                            Text("Teklifi Kabul Et ve Ödemeyi Rezerve Et")
                                                .font(.caption.bold())
                                                .foregroundStyle(.white)
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 10)
                                                .background(FoundrlyTheme.primary)
                                                .clipShape(Capsule())
                                        }
                                    }
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                }
                            }
                            .foundrlyCard()
                        }
                        
                        // Section 2: paid_reserved status
                        let paid = viewModel.myMentorRequests.filter { $0.status == "paid_reserved" }
                        if !paid.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Ödemesi Rezerve Edilenler")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                ForEach(paid) { req in
                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(req.mentor_details?.full_name ?? "Mentör")
                                            .font(.subheadline.bold())
                                        
                                        HStack {
                                            Label(req.meeting_time ?? "Belirtilmedi", systemImage: "clock")
                                            Spacer()
                                            Text("₺\(Int(req.offered_price))")
                                                .font(.headline.bold())
                                                .foregroundStyle(FoundrlyTheme.accent)
                                        }
                                        .font(.footnote)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        
                                        Text("Sıradaki Adım: Mentör görüşmeyi gerçekleştirecek ve tamamlandı olarak işaretleyecek.")
                                            .font(.caption2)
                                            .foregroundStyle(FoundrlyTheme.accent)
                                            .padding(8)
                                            .background(FoundrlyTheme.accent.opacity(0.08))
                                            .clipShape(RoundedRectangle(cornerRadius: 8))
                                    }
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                }
                            }
                            .foundrlyCard()
                        }
                        
                        // Section 3: mentor_completed status
                        let completed = viewModel.myMentorRequests.filter { $0.status == "mentor_completed" }
                        if !completed.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Tamamlandı Onayı Bekleyenler")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                ForEach(completed) { req in
                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(req.mentor_details?.full_name ?? "Mentör")
                                            .font(.subheadline.bold())
                                        
                                        HStack {
                                            Label(req.meeting_time ?? "Belirtilmedi", systemImage: "clock")
                                            Spacer()
                                            Text("₺\(Int(req.offered_price))")
                                                .font(.headline.bold())
                                                .foregroundStyle(FoundrlyTheme.accent)
                                        }
                                        .font(.footnote)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        
                                        HStack(spacing: 12) {
                                            Button {
                                                Task {
                                                    await viewModel.userConfirmMentor(session: session, requestId: req.id, action: "confirm_completion")
                                                }
                                            } label: {
                                                Text("Onayla & Ödemeyi Serbest Bırak")
                                                    .font(.caption.bold())
                                                    .foregroundStyle(.white)
                                                    .padding(.horizontal, 14)
                                                    .padding(.vertical, 8)
                                                    .background(FoundrlyTheme.accent)
                                                    .clipShape(Capsule())
                                            }
                                            
                                            Button {
                                                selectedRequestId = req.id
                                                showDisputeSheet = true
                                            } label: {
                                                Text("İtiraz Et")
                                                    .font(.caption.bold())
                                                    .foregroundStyle(FoundrlyTheme.error)
                                                    .padding(.horizontal, 14)
                                                    .padding(.vertical, 8)
                                                    .background(FoundrlyTheme.error.opacity(0.12))
                                                    .clipShape(Capsule())
                                            }
                                        }
                                        .padding(.top, 4)
                                    }
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                }
                            }
                            .foundrlyCard()
                        }
                        
                        // Other requests (pending, declined, released, disputed)
                        let other = viewModel.myMentorRequests.filter { !["offered", "paid_reserved", "mentor_completed"].contains($0.status) }
                        if !other.isEmpty {
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Talep Geçmişi")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                ForEach(other) { req in
                                    HStack {
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(req.mentor_details?.full_name ?? "Mentör")
                                                .font(.subheadline.bold())
                                                .foregroundStyle(FoundrlyTheme.textPrimary)
                                            
                                            Text(req.created_at)
                                                .font(.caption2)
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                        }
                                        
                                        Spacer()
                                        
                                        FoundrlyStatusBadge(status: req.status)
                                    }
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised.opacity(0.6))
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
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
        .navigationTitle("Mentorluk")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showDisputeSheet) {
            ZStack {
                FoundrlyTheme.surface.ignoresSafeArea()
                VStack(spacing: 20) {
                    Text("Görüşme İtirazı")
                        .font(.headline)
                        .foregroundStyle(FoundrlyTheme.textPrimary)
                    
                    Text("Lütfen görüşmeyle ilgili yaşadığınız sorunu açıklayın. Admin ekibimiz inceleyecektir.")
                        .font(.caption)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                        .multilineTextAlignment(.center)
                    
                    TextField("İtiraz nedeninizi girin...", text: $disputeReason, axis: .vertical)
                        .textFieldStyle(.plain)
                        .lineLimit(4...6)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(.white)
                    
                    HStack(spacing: 16) {
                        Button("İptal") {
                            showDisputeSheet = false
                            disputeReason = ""
                            selectedRequestId = nil
                        }
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        
                        Button("Gönder") {
                            if let id = selectedRequestId {
                                Task {
                                    await viewModel.userConfirmMentor(session: session, requestId: id, action: "open_dispute", disputeReason: disputeReason)
                                    showDisputeSheet = false
                                    disputeReason = ""
                                    selectedRequestId = nil
                                }
                            }
                        }
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.error)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                }
                .padding(24)
            }
            .presentationDetents([.medium])
        }
    }
}
