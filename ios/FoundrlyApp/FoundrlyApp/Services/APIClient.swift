import Foundation

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case server(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Geçersiz sunucu adresi."
        case .invalidResponse:
            return "Sunucudan beklenmeyen bir cevap geldi."
        case .server(let message):
            return message
        }
    }
}

struct APIClient {
    var baseURL = URL(string: "https://foundrly-backend-lamb.onrender.com")!

    func send<T: Decodable>(
        path: String,
        method: String = "GET",
        token: String? = nil,
        body: Data? = nil
    ) async throws -> T {
        var urlString = baseURL.absoluteString
        if !urlString.hasSuffix("/") && !path.hasPrefix("/") {
            urlString.append("/")
        }
        urlString.append(path)
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        if (200..<300).contains(httpResponse.statusCode) {
            do {
                return try JSONDecoder().decode(T.self, from: data)
            } catch let error as DecodingError {
                var detail = "Veri çözümleme hatası: "
                switch error {
                case .typeMismatch(let type, let context):
                    let path = context.codingPath.map { $0.stringValue }.joined(separator: ".")
                    detail += "Tip uyuşmazlığı. '\(path)' alanı \(type) beklenirken farklı bir tip geldi. (Hata: \(context.debugDescription))"
                case .valueNotFound(let type, let context):
                    let path = context.codingPath.map { $0.stringValue }.joined(separator: ".")
                    detail += "Değer bulunamadı. '\(path)' alanı (\(type)) null veya eksik. (Hata: \(context.debugDescription))"
                case .keyNotFound(let key, let context):
                    let path = (context.codingPath + [key]).map { $0.stringValue }.joined(separator: ".")
                    detail += "Anahtar bulunamadı. '\(path)' alanı eksik. (Hata: \(context.debugDescription))"
                case .dataCorrupted(let context):
                    detail += "Veri bozuk. (Hata: \(context.debugDescription))"
                @unknown default:
                    detail += error.localizedDescription
                }
                print("DECODING ERROR DETECTED: \(detail)")
                if let jsonString = String(data: data, encoding: .utf8) {
                    print("FAILED JSON: \(jsonString)")
                }
                throw APIError.server(detail)
            } catch {
                throw error
            }
        }

        if
            let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
            let detail = json["detail"] as? String
        {
            throw APIError.server(detail)
        }

        throw APIError.server("İşlem tamamlanamadı.")
    }

    func sendWithoutResponse(
        path: String,
        method: String = "POST",
        token: String,
        body: Data? = nil
    ) async throws {
        var urlString = baseURL.absoluteString
        if !urlString.hasSuffix("/") && !path.hasPrefix("/") {
            urlString.append("/")
        }
        urlString.append(path)
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            if
                let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                let detail = json["detail"] as? String
            {
                throw APIError.server(detail)
            }
            throw APIError.server("İşlem tamamlanamadı.")
        }
    }

    func sendDelete(path: String, token: String) async throws {
        var urlString = baseURL.absoluteString
        if !urlString.hasSuffix("/") && !path.hasPrefix("/") {
            urlString.append("/")
        }
        urlString.append(path)
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else { throw APIError.invalidResponse }
        guard (200..<300).contains(httpResponse.statusCode) else {
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let detail = json["detail"] as? String {
                throw APIError.server(detail)
            }
            throw APIError.server("İşlem tamamlanamadı.")
        }
    }
}
