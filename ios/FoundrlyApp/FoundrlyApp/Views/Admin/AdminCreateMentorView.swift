import SwiftUI

struct AdminCreateMentorView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    @Environment(\.dismiss) private var dismiss
    
    @State private var fullName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var title = ""
    @State private var mentorPriceString = ""

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Manuel Mentör Ekle")
                            .font(.title3.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        Text("Sistem genelinde doğrudan mentör olarak çalışacak ve otomatik premium yetkilerine sahip bir kullanıcı oluşturun.")
                            .font(.caption)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    VStack(spacing: 16) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Ad Soyad")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            TextField("Örn: Ahmet Yılmaz", text: $fullName)
                                .textFieldStyle(.plain)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .foregroundStyle(.white)
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("E-posta Adresi")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            TextField("Örn: ahmet@foundrly.com", text: $email)
                                .textFieldStyle(.plain)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .foregroundStyle(.white)
                                .keyboardType(.emailAddress)
                                .autocorrectionDisabled()
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Şifre")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            SecureField("En az 6 karakter", text: $password)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .foregroundStyle(.white)
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Ünvan / Rol")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            TextField("Örn: Senior iOS Developer", text: $title)
                                .textFieldStyle(.plain)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .foregroundStyle(.white)
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Görüşme Ücreti (₺)")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            TextField("Örn: 250", text: $mentorPriceString)
                                .textFieldStyle(.plain)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .foregroundStyle(.white)
                                .keyboardType(.numberPad)
                        }
                        
                        Button {
                            Task {
                                let price = Double(mentorPriceString) ?? 0.0
                                let req = AdminCreateUserRequest(
                                    email: email,
                                    password: password,
                                    full_name: fullName,
                                    title: title,
                                    is_mentor: true,
                                    mentor_price: price
                                )
                                await adminVM.createUser(session: session, request: req)
                                dismiss()
                            }
                        } label: {
                            Text("Mentör Oluştur")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.primary)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .padding(.top, 10)
                    }
                    .foundrlyCard()
                }
                .padding(20)
            }
        }
        .navigationTitle("Mentör Ekle")
        .navigationBarTitleDisplayMode(.inline)
    }
}
