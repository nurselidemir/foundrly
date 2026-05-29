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
    var baseURL = URL(string: "http://localhost:8000")!

    private func makeURL(path: String) throws -> URL {
        guard var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else {
            throw APIError.invalidURL
        }

        let normalizedPath = path.hasPrefix("/") ? String(path.dropFirst()) : path
        let pieces = normalizedPath.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)
        let cleanPath = String(pieces[0])
        components.path = "/" + cleanPath

        if pieces.count > 1 {
            components.percentEncodedQuery = String(pieces[1])
        }

        guard let url = components.url else {
            throw APIError.invalidURL
        }

        return url
    }

    private func parseServerMessage(data: Data, statusCode: Int) -> String {
        if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            if let detail = json["detail"] as? String {
                return detail
            }
            if let detail = json["detail"] as? [String] {
                return detail.joined(separator: "\n")
            }
            if let firstError = json.values.compactMap({ value -> String? in
                if let stringValue = value as? String {
                    return stringValue
                }
                if let listValue = value as? [String] {
                    return listValue.joined(separator: "\n")
                }
                return nil
            }).first {
                return firstError
            }
        }

        if let rawBody = String(data: data, encoding: .utf8), !rawBody.isEmpty {
            return rawBody
        }

        return "İşlem tamamlanamadı. (\(statusCode))"
    }

    func send<T: Decodable>(
        path: String,
        method: String = "GET",
        token: String? = nil,
        body: Data? = nil
    ) async throws -> T {
        var request = URLRequest(url: try makeURL(path: path))
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
            } catch {
                let rawBody = String(data: data, encoding: .utf8) ?? "Ham cevap okunamadi."
                throw APIError.server("Veri formati uyusmadi: \(rawBody)")
            }
        }

        throw APIError.server(parseServerMessage(data: data, statusCode: httpResponse.statusCode))
    }

    func sendWithoutResponse(
        path: String,
        method: String = "POST",
        token: String,
        body: Data? = nil
    ) async throws {
        var request = URLRequest(url: try makeURL(path: path))
        request.httpMethod = method
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            throw APIError.server(parseServerMessage(data: data, statusCode: httpResponse.statusCode))
        }
    }

    func sendJSONObject(
        path: String,
        method: String = "GET",
        token: String? = nil,
        body: Data? = nil
    ) async throws -> [String: Any] {
        var request = URLRequest(url: try makeURL(path: path))
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

        guard (200..<300).contains(httpResponse.statusCode) else {
            throw APIError.server(parseServerMessage(data: data, statusCode: httpResponse.statusCode))
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw APIError.server("Sunucu cevabı sözlük formatında değil.")
        }

        return json
    }
}
