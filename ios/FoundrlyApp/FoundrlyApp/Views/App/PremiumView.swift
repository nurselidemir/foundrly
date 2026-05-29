import SwiftUI

struct PremiumView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 24) {
                    // Hero Card
                    VStack(spacing: 16) {
                        Image(systemName: "crown.fill")
                            .font(.system(size: 60))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color(red: 255/255, green: 215/255, blue: 0), Color(red: 255/255, green: 165/255, blue: 0)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .shadow(color: Color.orange.opacity(0.3), radius: 10)
                        
                        Text("FOUNDRLY PREMIUM")
                            .font(.system(size: 26, weight: .black, design: .rounded))
                            .foregroundStyle(.white)
                            .tracking(2)
                        
                        Text("Girişimcilik serüveninde sınırları kaldır. Ekibini kur, mentörlüğe eriş ve öne çık.")
                            .font(.subheadline)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 10)
                        
                        if session.isPremium {
                            HStack(spacing: 6) {
                                Image(systemName: "checkmark.seal.fill")
                                Text("Premium Üyeliğiniz Aktif")
                            }
                            .font(.headline)
                            .foregroundStyle(FoundrlyTheme.accent)
                            .padding(.horizontal, 18)
                            .padding(.vertical, 8)
                            .background(FoundrlyTheme.accent.opacity(0.12))
                            .clipShape(Capsule())
                            .padding(.top, 4)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .foundrlyCard()
                    
                    // Features list
                    VStack(alignment: .leading, spacing: 18) {
                        Text("Ayrıcalıklar")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                            .padding(.bottom, 4)
                        
                        featureRow(icon: "sparkles", title: "AI Takım Eşleşmeleri", description: "Yapay zeka projen için en uyumlu takım arkadaşlarını bulur.")
                        featureRow(icon: "checkmark.seal", title: "Doğrulanmış Yetenek Başvurusu", description: "Başvurularınızda rozetinizle öne çıkın ve güven kazanın.")
                        featureRow(icon: "bolt.fill", title: "Proje Görünürlük Artışı", description: "Oluşturduğunuz projeler keşfet sekmesinde en üst sırada yer alır.")
                        featureRow(icon: "person.2.fill", title: "Mentörlük Erişimi", description: "Ekosistemin en iyi mentörlerinden birebir destek alın.")
                        featureRow(icon: "slider.horizontal.3", title: "Gelişmiş Filtreler", description: "Projeleri ve yetenekleri en detaylı kriterlerle arayın.")
                    }
                    .foundrlyCard()
                    
                    if !session.isPremium {
                        // Pricing section
                        VStack(spacing: 16) {
                            Text("Üyelik Planları")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            HStack(spacing: 16) {
                                // Monthly
                                VStack(spacing: 12) {
                                    Text("Aylık")
                                        .font(.subheadline.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    Text("₺199")
                                        .font(.system(size: 28, weight: .black, design: .rounded))
                                        .foregroundStyle(.white)
                                    
                                    Text("/ ay")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    Button {
                                        Task {
                                            await viewModel.activatePremium(session: session, plan: "monthly")
                                        }
                                    } label: {
                                        Text("Seç")
                                            .font(.footnote.bold())
                                            .foregroundStyle(.white)
                                            .padding(.horizontal, 18)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.primary)
                                            .clipShape(Capsule())
                                    }
                                }
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                                
                                // Annual
                                VStack(spacing: 12) {
                                    HStack {
                                        Spacer()
                                        Text("%17 İndirim")
                                            .font(.system(size: 8, weight: .bold))
                                            .foregroundStyle(.black)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 3)
                                            .background(FoundrlyTheme.accent)
                                            .clipShape(Capsule())
                                    }
                                    .padding(.top, -10)
                                    .padding(.trailing, -5)
                                    
                                    Text("Yıllık")
                                        .font(.subheadline.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    Text("₺1.990")
                                        .font(.system(size: 28, weight: .black, design: .rounded))
                                        .foregroundStyle(.white)
                                    
                                    Text("/ yıl")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    Button {
                                        Task {
                                            await viewModel.activatePremium(session: session, plan: "yearly")
                                        }
                                    } label: {
                                        Text("Seç")
                                            .font(.footnote.bold())
                                            .foregroundStyle(.black)
                                            .padding(.horizontal, 18)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.accent)
                                            .clipShape(Capsule())
                                    }
                                }
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(FoundrlyTheme.accent.opacity(0.4), lineWidth: 1.5)
                                )
                            }
                        }
                        .foundrlyCard()
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
        .navigationTitle("Premium")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func featureRow(icon: String, title: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundStyle(FoundrlyTheme.primary)
                .frame(width: 28, height: 28)
                .background(FoundrlyTheme.primary.opacity(0.12))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline.bold())
                    .foregroundStyle(FoundrlyTheme.textPrimary)
                Text(description)
                    .font(.caption)
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            }
            
            Spacer()
        }
    }
}
