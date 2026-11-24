package com.example.banking.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.example.banking.api.BankingRequests;
import com.example.banking.api.BankingViews.AuthUser;
import com.example.banking.user.UserDocument;
import com.example.banking.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.util.ReflectionTestUtils;

class AuthServiceTest {
    @Test
    void loginFindsUsernameRegardlessOfStoredCase() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtEncoder jwtEncoder = mock(JwtEncoder.class);
        Jwt jwt = mock(Jwt.class);
        UserDocument user = new UserDocument("Abhi", "Abhi Taware", "encoded-password", "ADMIN");
        ReflectionTestUtils.setField(user, "id", "user-id");
        AuthService authService = new AuthService(
                userRepository, passwordEncoder, jwtEncoder, mock(BankingService.class));

        when(userRepository.findByUsernameIgnoreCase("abhi")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correct-password", "encoded-password")).thenReturn(true);
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(jwt);
        when(jwt.getTokenValue()).thenReturn("signed-token");

        AuthService.Session session = authService.login(
                new BankingRequests.Login("AbHi", "correct-password"));

        AuthUser authenticatedUser = session.getUser();
        assertEquals("Abhi", authenticatedUser.getUsername());
        assertEquals("ADMIN", authenticatedUser.getRole());
        verify(userRepository).findByUsernameIgnoreCase("abhi");
    }
}
