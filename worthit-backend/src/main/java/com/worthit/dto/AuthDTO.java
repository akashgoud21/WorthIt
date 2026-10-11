package com.worthit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        @Size(max = 100)
        private String name;

        @Email(message = "Must be a valid email")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public RegisterRequest() {}

        public RegisterRequest(String name, String email, String password) {
            this.name = name;
            this.email = email;
            this.password = password;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String joinedDate;

        public AuthResponse() {}

        public AuthResponse(String token, Long id, String name, String email, String joinedDate) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.joinedDate = joinedDate;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String token;
            private Long id;
            private String name;
            private String email;
            private String joinedDate;

            public Builder token(String token) { this.token = token; return this; }
            public Builder id(Long id) { this.id = id; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder joinedDate(String joinedDate) { this.joinedDate = joinedDate; return this; }

            public AuthResponse build() {
                return new AuthResponse(token, id, name, email, joinedDate);
            }
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getJoinedDate() { return joinedDate; }
        public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }
    }
}
