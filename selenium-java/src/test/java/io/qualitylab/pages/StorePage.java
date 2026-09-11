package io.qualitylab.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public final class StorePage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public StorePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    public String heading() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("store-title"))).getText();
    }

    public StorePage addProduct(String productName) {
        By addButton = By.xpath("//button[normalize-space()='Add " + productName + " to cart']");
        wait.until(ExpectedConditions.elementToBeClickable(addButton)).click();
        return this;
    }

    public int cartCount() {
        return Integer.parseInt(driver.findElement(By.id("cart-count")).getText());
    }

    public String placeOrder() {
        driver.findElement(By.id("checkout")).click();
        By status = By.id("order-status");
        wait.until(ExpectedConditions.textMatches(status, java.util.regex.Pattern.compile("Order .* confirmed.*")));
        return driver.findElement(status).getText();
    }
}
