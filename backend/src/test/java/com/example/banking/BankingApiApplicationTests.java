package com.example.banking;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.time.Instant;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.core.env.Environment;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest(properties = {
		"app.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
		"spring.data.mongodb.auto-index-creation=false"
})
class BankingApiApplicationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtEncoder jwtEncoder;

	@Autowired
	private Environment environment;

	@Test
	void contextLoads() {
	}

	@Test
	void backendEnvProvidesRemoteMongoUri() {
		String uri = environment.getProperty("spring.mongodb.uri", "");
		assertFalse(uri.startsWith("mongodb://localhost:"), "Spring resolved the localhost fallback instead of backend/config/.env");
	}

	@Test
	void bankingApiRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/api/accounts"))
				.andExpect(status().isUnauthorized());
	}

	    @Test
	    void customerRoleInJwtCookieCanReadCurrentUser() throws Exception {
		Instant now = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer("banking-api")
			.subject("test-user-id")
			.issuedAt(now)
			.expiresAt(now.plusSeconds(300))
			.claim("username", "test-user")
			.claim("fullName", "Test User")
			.claim("role", "CUSTOMER")
			.build();
		String token = jwtEncoder.encode(JwtEncoderParameters.from(
			JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();

		mockMvc.perform(get("/api/auth/me").cookie(new Cookie("BANKING_TOKEN", token)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.username").value("test-user"));
	    }
}
