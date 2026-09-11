package io.qualitylab.tests;

import io.qualitylab.pages.LoginPage;
import io.qualitylab.pages.StorePage;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class StoreJourneyTest extends BaseTest {
    @Test
    void userCanSignInAndPlaceAnOrder() {
        StorePage store = new LoginPage(driver)
                .open(baseUrl)
                .signIn(
                        "selenium-user-" + System.nanoTime() + "@example.test",
                        "local-test-" + System.nanoTime());

        assertEquals("Find your workspace essentials", store.heading());
        store.addProduct("Mechanical Keyboard");
        assertEquals(1, store.cartCount());
        assertTrue(store.placeOrder().contains("confirmed"));
    }

    @Test
    void invalidCredentialsReturnAnActionableMessage() {
        String message = new LoginPage(driver)
                .open(baseUrl)
                .signInExpectingFailure(
                        "selenium-user-" + System.nanoTime() + "@example.test",
                        "short");
        assertEquals("Email or password is incorrect", message);
    }
}
